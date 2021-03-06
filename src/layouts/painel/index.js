import { Component } from "react";
import Header from "../../components/Header";
import VerticalNav from "../../components/VerticalNav";
import "./style.sass";

import { Context } from "../../store";

import LoadingQuestions from "../../components/LoadingQuestions";
import RepoSelection from "../../components/RepoSelection";
import { ParallelContext } from "../../parallelStore";

export default class Painel extends Component {
  static contextType = Context;
  state = {
    loading: true,
  };
  loading = (status) => {
    this.setState({
      loading: status,
    });
  };
  render() {
    const repo = localStorage.getItem("repo");

    return (
      <div className="l-painel">
        <div className="l-painel__leftnav">
          <ParallelContext.Consumer>
            {(parallel) => (
              <VerticalNav
                onLoadChange={(status) => this.loading(status)}
                parallel={parallel}
              />
            )}
          </ParallelContext.Consumer>
        </div>
        <div className="l-painel__right">
          <Header className="l-painel__header test" />
          <div className="l-painel__content">
            {!repo ? (
              <RepoSelection indestructible onClose={() => {}} />
            ) : this.state.loading ? (
              <LoadingQuestions />
            ) : (
              this.props.children
            )}
          </div>
        </div>
      </div>
    );
  }
}
