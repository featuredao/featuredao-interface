import { HashRouter, Route, Switch } from 'react-router-dom'
// import { Redirect, useParams } from 'react-router'
// import { Suspense, lazy } from 'react'
import Home from './components/Home';
import Projects from './components/Projects';
import ProjectDetail from './components/Projects/Detail';
import Create from './components/Home/Create';

// function CatchallRedirect() {
//   const route = useParams()['route']
//   return <Redirect to={'/p/' + route} />
// }

export default function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/create">
          <Create />
        </Route>

        <Route path="/features/">
          <Projects />
        </Route>
        <Route path="/f/:projId">
          <ProjectDetail />
        </Route>

        {/*

        <Route path="/features/:owner">
          <Projects />
        </Route>
        <Route path="/projects">
          <Projects />
        </Route>
        <Route path="/v2/create">
          <Suspense fallback={<Loading />}>
            <V2Create />
          </Suspense>
        </Route>
        <Route path="/v2/p/:projId">
          <Suspense fallback={<Loading />}>
            <V2UserProvider>
              <V2Dashboard />
            </V2UserProvider>
          </Suspense>
        </Route>
        <Route path="/:route">
          <CatchallRedirect />
        </Route> */}
      </Switch>
    </HashRouter>
  )
}
