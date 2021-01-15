import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import CrawlLinks from "./CrawlLinks";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/crawl_links/:id" component={CrawlLinks} />
    </Switch>
  );
};

export default App;
