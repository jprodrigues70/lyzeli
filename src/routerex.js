import { Fragment } from "react";
import { Route } from "react-router-dom";
import Files from "./plugins/Files";

export default function Routerex() {
  const pagesFiles = require.context(`./pages`, true, /.*\.(js)$/);
  const layoutsFiles = require.context("./layouts", true, /.*\.(js)$/);

  return Files.getComponents(pagesFiles).map(
    ({ default: Component, config }) => {
      const Layout = config.layout
        ? Files.getComponent(`./${config.layout}/index.js`, layoutsFiles)
            .default
        : Fragment;
      return (
        <Route
          key={config.name}
          exact={config.exactRoute !== undefined ? config.exactRoute : true}
          path={config.route}
        >
          <Layout>
            <Component />
          </Layout>
        </Route>
      );
    }
  );
}
