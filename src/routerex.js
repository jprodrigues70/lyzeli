import { Fragment } from "react";
import { Route } from "react-router-dom";


const getComponents = (files) => {
  return files.keys().map((page) => {
    return getComponent(page, files)
  })
}

const getComponent = (componentName, files) => {
  return files(componentName)
}

export default function Routerex() {
  const pagesFiles = require.context(`./pages`, true, /.*\.(js)$/)
  const layoutsFiles = require.context('./layouts', true, /.*\.(js)$/)

  return getComponents(pagesFiles).map(({default: Component, config}) => {
    const Layout = config.layout ? getComponent(`./${config.layout}/index.js`, layoutsFiles).default : Fragment
    return (
      <Route key={config.name} exact={config.exactRoute !== undefined ? config.exactRoute : true} path={config.route}>
        <Layout>
          <Component />
        </Layout>
      </Route>
    )
  })
}
