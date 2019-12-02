

const routes = [{
  path: '/login',
  name: 'Login',
  meta: {hidden: true},
  component: (resolve) => require(['components/login/index'], resolve)
}, {
  path: '/',
  meta: {title: '首页', icon: 'icon-monitor'},
  name: 'Dashboard',
  redirect: '/home',
  hidden: true,
  component: (resolve) => require(['components/app/app-frame'], resolve),
  children: [{
    path: '/home',
    name: 'Home',
    meta: {title: '首页', icon: 'icon-monitor', hidden: true},
    component: (resolve) => require(['components/home/index'], resolve),
  },
    // {
    //   path: '/account-basic',
    //   name: 'AccountBasic',
    //   component: (resolve) => require(['components/demo-components/account/account'], resolve),
    //   meta: {title: '个人中心', icon: 'icon-head', hidden: true}
    // }
   ]
},

]


export default routes
