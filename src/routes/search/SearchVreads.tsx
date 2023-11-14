import { useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
import {
  IVread,
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
  getSearchVreads,
} from "../../components/springApi/springVreads";
import { Button } from "../../style/Button";
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  width: 100%;
`;

const TimelineWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
`;

const SearchBtn = styled.button`
  display: inline-block;
  border: none;
  border-radius: 10px;
  width: 100px;
  font-size: large;
  margin-left: 5px;
  padding: 10px 0px;
  background-color: #fcbb79;
  color: white;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  &.toggleBtn {
    background-color: black;
    border: 2px solid #fcbb79;
    width: 150px;
  }
  &.activeBtn {
    background-color: white;
    color: black;
  }
  &:hover {
    background-color: white;
    color: black;
  }
`;

const SearchInputBox = styled.article`
  display: flex;
  width: 100%;
  &.toggler {
    justify-content: center;
  }
`;

export default function SearchVreads() {
  const [searchOption, setSearchOption] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startCount, setStartCount] = useState(START_COUNT_INIT);
  const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchVreads, setSearchVreads] = useState<IVread[]>([]);

  const onChangeKeywordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setSearchKeyword(value);
  };

  const onSearchHandler = async (isSearchMore: boolean) => {
    if (isSearchLoading) return;

    setIsSearchLoading(true);

    // 만약 load more 을 눌렀을때 카운트 셋팅 하기
    // 주의! 수정 해준뒤 변수에 따로 담아 똑같은 값으로 추가 해 준 뒤 사용
    // useState 는 변경 직후가 아닌 스냅샷 값을 이용하기 때문
    let startLimit = startCount;
    let pageLimit = pageListLimit;

    if (!isSearchMore) {
      setStartCount(START_COUNT_INIT);
      startLimit = START_COUNT_INIT;
    } else {
      setStartCount((state) => state + SET_PAGE_LIST_LIMIT_INIT);
      startLimit += SET_PAGE_LIST_LIMIT_INIT;
    }

    if (!isSearchMore) {
      setPageListLimit(SET_PAGE_LIST_LIMIT_INIT);
      pageLimit = SET_PAGE_LIST_LIMIT_INIT;
    } else {
      setPageListLimit((state) => state + SET_PAGE_LIST_LIMIT_INIT);
      pageLimit += SET_PAGE_LIST_LIMIT_INIT;
    }

    if (searchKeyword !== "") {
      setSearchError("");
      const result = await getSearchVreads(
        searchKeyword,
        searchOption,
        startLimit,
        pageLimit
      );

      if (result.state !== "true") {
        setSearchError(result.error);
      } else {
        // setLimitStart((state) => state + limit);
        const resultVreads = result.data;
        if (isSearchMore)
          setSearchVreads((state) => [...state, ...resultVreads]);
        else setSearchVreads(resultVreads);
      }
    }
    setIsSearchLoading(false);
  };

  // 더보기 구현
  const onLoadMore = () => {
    onSearchHandler(true);
  };

  const onKeydownSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchHandler(false);
    }
  };

  const onToggleSearchOption = (e: React.ChangeEvent<HTMLButtonElement>) => {
    const { name } = e.target;
    if (name === "title") setSearchOption(1);
    else if (name === "titleDetail") setSearchOption(2);
  };
  return (
    <Wrapper>
      <SearchInputBox>
        <Input
          name="search-keyword"
          id="search-keyword"
          maxLength={100}
          value={searchKeyword}
          onChange={onChangeKeywordHandler}
          onKeyDown={onKeydownSearchHandler}
          placeholder="Which Vread are you searching for?"
          required
        />
        <SearchBtn onClick={() => onSearchHandler(false)}>Search</SearchBtn>
      </SearchInputBox>
      <SearchInputBox className="toggler">
        <SearchBtn
          className={"toggleBtn" + (searchOption === 1 ? " activeBtn" : "")}
          name="title"
          onClick={onToggleSearchOption}
        >
          Title
        </SearchBtn>
        <SearchBtn
          className={"toggleBtn" + (searchOption === 2 ? " activeBtn" : "")}
          name="titleDetail"
          onClick={onToggleSearchOption}
        >
          Title + Detail
        </SearchBtn>
      </SearchInputBox>
      {searchError !== "" && <Error>{searchError}</Error>}
      <TimelineWrapper>
        {searchVreads.length <= 0 && (
          <p>There is no Vread matching your search term.</p>
        )}
        {searchVreads.length > 0 &&
          searchVreads.map((vread) => (
            <Vread key={vread.vreads_idx + "_search"} vread={vread} />
          ))}
        {searchVreads && searchVreads.length > 0 ? (
          <Button onClick={onLoadMore}>Load more</Button>
        ) : (
          ""
        )}
      </TimelineWrapper>
    </Wrapper>
  );
}
