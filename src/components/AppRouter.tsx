import { Route, Routes } from "react-router-dom";
import ImagesFeed from "../pages/ImagesFeedPage";
import ImagesPages from "../pages/ImagesPages";

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<ImagesPages />} />
      <Route path='/feed' element={<ImagesFeed />} />
    </Routes>
  );
}

export default AppRouter;
