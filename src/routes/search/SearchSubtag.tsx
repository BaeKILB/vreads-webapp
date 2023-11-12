import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
import { useParams } from "react-router-dom";
import {
  IVread,
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
  getSearchVreads,
} from "../../components/springApi/springVreads";
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

export default function SearchSubtag() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startCount, setStartCount] = useState(START_COUNT_INIT);
  const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchVreads, setSearchVreads] = useState<IVread[]>([]);

  // url 파라미터 들고오기
  const { subTag } = useParams();

  const onChangeKeywordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setSearchKeyword(value);
  };

  const onSearchHandler = async (
    isSearchMore: boolean,
    paramKeyword: string | null
  ) => {
    if (!isSearchMore) setStartCount(START_COUNT_INIT);
    else setStartCount((state) => state + SET_PAGE_LIST_LIMIT_INIT);

    if (!isSearchMore) setPageListLimit(SET_PAGE_LIST_LIMIT_INIT);
    else setPageListLimit((state) => state + SET_PAGE_LIST_LIMIT_INIT);

    // 로딩중이면 중복동작 안하도록
    if (isSearchLoading) return;

    setIsSearchLoading(true);

    // 동작
    //키워드 있는지 확인
    // 또는 파라미터에 키워드 들고 오는경우 체크
    if (searchKeyword !== "" || (paramKeyword && paramKeyword !== "")) {
      setSearchError("");
      let kw = searchKeyword;
      if (paramKeyword && paramKeyword !== "") kw = paramKeyword;

      // getSearchVreads 에서 3번은 서브태그
      const result = await getSearchVreads(kw, 3, startCount, pageListLimit);
      if (result.state !== "true") {
        setSearchError(result.error);
      } else {
        const resultVreads = result.data;
        if (isSearchMore)
          setSearchVreads((state) => [...state, ...resultVreads]);
        else setSearchVreads(resultVreads);
      }
    }
    setIsSearchLoading(false);
  };

  const onKeydownSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchHandler(false, null);
    }
  };

  useEffect(() => {
    if (subTag) {
      onSearchHandler(false, subTag);
    }
  }, []);

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
          placeholder="Which Vread SubTag are you searching for?"
          required
        />
        <SearchBtn onClick={() => onSearchHandler(false, null)}>
          Search
        </SearchBtn>
      </SearchInputBox>

      {searchError !== "" && <Error>{searchError}</Error>}
      <TimelineWrapper>
        {searchVreads.length <= 0 && (
          <p>There is no Vread matching your search term.</p>
        )}
        {searchVreads.length > 0 &&
          searchVreads.map((vread) => (
            <Vread key={vread.id + "_search"} vread={vread} />
          ))}
        {/* {searchVreads.length > 0 && (
          <SearchBtn onClick={() => onSearchHandler(true)}>Load More</SearchBtn>
        )} */}
      </TimelineWrapper>
    </Wrapper>
  );
}
