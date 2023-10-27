import { useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { IVread, getVreads } from "../../fbCode/fdb";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
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
  const [searchOption, setSearchOption] = useState(3);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [limitStart, setLimitStart] = useState("");
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
    const limit = 30;
    if (!isSearchMore) setLimitStart("");
    if (isSearchLoading) return;
    setIsSearchLoading(true);
    if (searchKeyword !== "") {
      setSearchError("");
      const resultVreads = await getVreads(
        searchOption,
        null,
        limit,
        limitStart,
        searchKeyword
      );
      if (
        !resultVreads ||
        !resultVreads.vreads ||
        resultVreads.state === false
      ) {
        setSearchError(resultVreads.error);
      } else {
        // setLimitStart((state) => state + limit);
        if (isSearchMore)
          setSearchVreads((state) => [...state, ...resultVreads.vreads]);
        else setSearchVreads(resultVreads.vreads);
      }
    }
    setIsSearchLoading(false);
  };

  const onKeydownSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchHandler(false);
    }
  };

  const onToggleSearchOption = (e: React.ChangeEvent<HTMLButtonElement>) => {
    const { name } = e.target;
    if (name === "titleDetail") setSearchOption(3);
    else if (name === "userName") setSearchOption(4);
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
          className={"toggleBtn" + (searchOption === 3 ? " activeBtn" : "")}
          name="titleDetail"
          onClick={onToggleSearchOption}
        >
          Title + Detail
        </SearchBtn>
        <SearchBtn
          className={"toggleBtn" + (searchOption === 4 ? " activeBtn" : "")}
          name="userName"
          onClick={onToggleSearchOption}
        >
          User name
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
