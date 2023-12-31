import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
import { useNavigate, useParams } from "react-router-dom";
import {
  IVread,
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
  SubTagInit,
  getSearchVreads,
  getSubtagList,
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
const SubtagListWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border: 2px solid #fcbb79;
  border-radius: 10px;
`;

const SubTagPayload = styled.p`
  margin: 10px 0px;
  width: 40%;
  font-size: 15px;
  font-style: italic;
  font-weight: bold;
  color: #fcbb79;
  display: inline-block;
  padding: 5px;
  border: 2px solid #fffbf81d;
  border-radius: 10px;
  transition: border 0.2s;
  &:hover {
    cursor: pointer;
    border: 2px solid #fcbb79;
  }
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
  const [reloadToggle, setReloadToggle] = useState(false);
  const [searchVreads, setSearchVreads] = useState<IVread[]>([]);
  const [subTagList, setSubTagList] = useState<SubTagInit[]>([]);

  // url 파라미터 들고오기
  let { subTag } = useParams();

  const navi = useNavigate();

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

    // 로딩중이면 중복동작 안하도록
    if (isSearchLoading) return;

    setIsSearchLoading(true);

    // 동작
    // 만약 subtag가 있는 상황에서 paramKeyword 들고온다면
    // subtag 를 빈값으로 변경

    if (paramKeyword) {
      subTag = "";
    }

    //키워드 있는지 확인
    // 또는 파라미터에 키워드 들고 오는경우 체크
    if (searchKeyword !== "" || (paramKeyword && paramKeyword !== "")) {
      setSearchError("");
      let kw = searchKeyword;
      if (paramKeyword && paramKeyword !== "") kw = paramKeyword;

      // getSearchVreads 에서 3번은 서브태그
      const result = await getSearchVreads(kw, 3, startLimit, pageLimit);
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

  // 더보기 구현
  const onLoadMore = () => {
    if (subTag && subTag !== "") {
      onSearchHandler(true, subTag);
    } else {
      onSearchHandler(true, null);
    }
  };

  // 많이 개시된 subtag 항목명 불러오기
  const onSubTagListHandler = async () => {
    // 로딩중이면 중복동작 안하도록
    if (isSearchLoading) return;

    setIsSearchLoading(true);

    // 동작

    // getSubtagList 에서 3번은 서브태그
    const result = await getSubtagList("", 3, 0, 6);
    if (result.state !== "true") {
      setSearchError(result.error);
    } else {
      const resultSubtags = result.data;
      setSubTagList(resultSubtags);
    }

    setIsSearchLoading(false);
  };

  const onClickPopularSubtag = (subtagStr: string) => {
    navi("/subtag/" + subtagStr);
    setReloadToggle((state) => !state);
  };

  useEffect(() => {
    if (subTag && subTag !== "") {
      onSearchHandler(false, subTag);
    }
    onSubTagListHandler();
  }, [reloadToggle]);

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

      {subTagList && subTagList.length > 0 ? (
        <>
          <h3>Popular Subtag List</h3>
          <SubtagListWrapper>
            {subTagList.map((subtag) => (
              <SubTagPayload
                key={subtag.vd_subtag + "_subtag"}
                onClick={() => {
                  onClickPopularSubtag(subtag.vd_subtag);
                }}
              >
                {subtag.vd_subtag} <br />/ count : {subtag.vd_subtag_count}
              </SubTagPayload>
            ))}
          </SubtagListWrapper>
        </>
      ) : (
        ""
      )}
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
