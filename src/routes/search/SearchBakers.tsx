import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { Error } from "../../style/etc_style";
import { useParams } from "react-router-dom";
import { IGetUser, getUsersInfo } from "../../fbCode/fLogin";
import ProfileBox from "../../components/search/profileBox";
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
  const [searchUsers, setSearchUsers] = useState<IGetUser[]>([]);
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
    const limit = 30;
    // if (!isSearchMore) setLimitStart("");
    if (isSearchLoading) return;
    setIsSearchLoading(true);
    setSearchError("");
    let kw = searchKeyword;
    if (paramKeyword && paramKeyword !== "") kw = paramKeyword;
    const resultusers = await getUsersInfo(kw, limit);
    if (!resultusers || !resultusers.users || resultusers.state === false) {
      setSearchError(resultusers.error);
    } else {
      // setLimitStart((state) => state + limit);
      if (isSearchMore)
        setSearchUsers((state) => [...state, ...resultusers.users]);
      else setSearchUsers(resultusers.users);
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
            <ProfileBox key={user.id + "_search"} userInfo={user} />
          ))}
        {/* {searchUsers.length > 0 && (
          <SearchBtn onClick={() => onSearchHandler(true)}>Load More</SearchBtn>
        )} */}
      </TimelineWrapper>
    </Wrapper>
  );
}
