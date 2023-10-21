import styled from "styled-components";
import PostVreadForm from "../../components/Home/post-vread-from";
import VreadsList from "../../components/Home/vreads-list";

const Home = () => {
  const Wrapper = styled.main`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    padding: 50px 0px;
  `;

  return (
    <Wrapper>
      <PostVreadForm />
      <VreadsList />
    </Wrapper>
  );
};
export default Home;
