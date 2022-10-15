import { FC } from "react";
import GlobalStyles from "../../components/layout/GlobalStyles/GlobalStyles";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import TodosContens from "./TodosContents";

const TodosPage: FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <TodosContens />
      <Footer />
    </div>
  );
};

export default TodosPage;
