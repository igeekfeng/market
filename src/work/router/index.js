import Home from '../pages/home';
import Login from '../pages/login'
import Basic from "../pages/basic";

let router = [
    {
        path: '/',//首页默认加载的页面
        componentName: Home,
        exact: true //是否为严格模式
    },
    {
        path: '/login',
        componentName: Login,
        exact: true //是否为严格模式
    },
    {
        path: '/basic',
        componentName: Basic,
    },
];

export default router;
