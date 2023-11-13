import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { Error } from "../../style/etc_style";
import { useParams } from "react-router-dom";
import ProfileBox from "../../components/search/profileBox";
import { IUser, getUserSearch } from "../../components/springApi/springUser";
import {
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
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
  flex-direction: row;
  flex-wrap: wrap;
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

export default function SearchBakers() {
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [limitStart, setLimitStart] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [startCount, setStartCount] = useState(START_COUNT_INIT);
  const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);
  const [searchDate, setSerchDate] = useState(new Date().getTime().toString());
  const [searchUsers, setSearchUsers] = useState<IUser[]>([]);
  const { userName } = useParams();

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
    // if (!isSearchMore) setLimitStart("");
    if (isSearchLoading) return;

    // 검색 시작
    setIsSearchLoading(true);
    setSearchError("");

    // 검색어 적용
    let kw = searchKeyword;

    // 파라미터 검색어 있다면 적용
    if (paramKeyword && paramKeyword !== "") kw = paramKeyword;

    // 날짜 및 리미트설정
    // 만약 더보기 버튼 누를때에는 가존 날짜 유지
    if (!isSearchMore) {
      setSerchDate(new Date().getTime().toString());
      setStartCount(START_COUNT_INIT);
      setPageListLimit(SET_PAGE_LIST_LIMIT_INIT);
    } else {
      setStartCount((state) => state + SET_PAGE_LIST_LIMIT_INIT);
      setPageListLimit((state) => state + SET_PAGE_LIST_LIMIT_INIT);
    }

    // 데이터 받아오기
    const result = await getUserSearch(
      kw,
      searchDate,
      startCount,
      pageListLimit
    );
    if (result.state != "true") {
      setSearchError(result.error);
      return;
    }
    const resultusers = result.data;
    if (!resultusers) {
      setSearchError("데이터 적용 중 문제가 발생했습니다!");
    } else {
      // setLimitStart((state) => state + limit);
      if (isSearchMore) setSearchUsers((state) => [...state, ...resultusers]);
      else setSearchUsers(resultusers);
    }

    setIsSearchLoading(false);
  };

  const onKeydownSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchHandler(false, null);
    }
  };

  useEffect(() => {
    if (userName) {
      onSearchHandler(false, userName);
    } else {
      onSearchHandler(false, null);
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
          placeholder="Let's find Users"
          required
        />
        <SearchBtn onClick={() => onSearchHandler(false, null)}>
          Search
        </SearchBtn>
      </SearchInputBox>

      {searchError !== "" && <Error>{searchError}</Error>}
      <TimelineWrapper>
        {searchUsers.length <= 0 && <p></p>}
        {searchUsers.length > 0 &&
          searchUsers.map((user) => (
            <ProfileBox key={user.mem_idx + "_search"} userInfo={user} />
          ))}
        {/* {searchUsers.length > 0 && (
          <SearchBtn onClick={() => onSearchHandler(true)}>Load More</SearchBtn>
        )} */}
      </TimelineWrapper>
    </Wrapper>
  );
}
