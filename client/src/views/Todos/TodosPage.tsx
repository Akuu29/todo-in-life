import GlobalStyles from "../../components/layout/GlobalStyles/GlobalStyles";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import TodosContents from "./TodosContents";
import { TodoProvider } from "../../components/context/TodoContext";

function TodosPage() {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <TodoProvider>
        <TodosContents />
      </TodoProvider>
      <Footer />
    </div>
  );
}

export default TodosPage;
