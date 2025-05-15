import { Link } from "react-router-dom";
function Home(){
    return(
        <div>
            Home Page
            <Link to={"register"}>Войти</Link>
            <Link to={"login"}>Войти</Link>
        </div>
    )
}

export default Home;