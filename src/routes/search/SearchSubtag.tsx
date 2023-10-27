import { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../../style/Input";
import { IVread, getVreads } from "../../fbCode/fdb";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
import { useParams } from "react-router-dom";
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
  const [limitStart, setLimitStart] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchVreads, setSearchVreads] = useState<IVread[]>([]);
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
    const limit = 30;
    if (!isSearchMore) setLimitStart("");
    if (isSearchLoading) return;
    setIsSearchLoading(true);
    if (searchKeyword !== "" || (paramKeyword && paramKeyword !== "")) {
      setSearchError("");
      let kw = searchKeyword;
      if (paramKeyword && paramKeyword !== "") kw = paramKeyword;
      const resultVreads = await getVreads(5, null, limit, limitStart, kw);
      if (
        !resultVreads ||
        !resultVreads.vreads ||
        resultVreads.state === false
      ) {
        setSearchError(resultVreads.error);
      } else {
        // setLimitStart((state) => state + limit);
        console.log(resultVreads.vreads);
        if (isSearchMore)
          setSearchVreads((state) => [...state, ...resultVreads.vreads]);
        else setSearchVreads(resultVreads.vreads);
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
