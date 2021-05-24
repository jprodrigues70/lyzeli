import { Component } from "react";
import QuestionMapper from "../../components/QuestionMapper";
import RawData from "../../components/RawData";
import Suitable from "../../components/Suitable";
import { Context } from "../../store";
import Loading from "../../assets/loading.gif";
import Save from "../../components/Save";

export default class Home extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  render() {
    const repo = localStorage.getItem("repo");

    if (repo) {
      const areas = [
        {
          key: "Presentation",
          content: () => <QuestionMapper />,
        },
        {
          key: "Raw data",
          content: () => <RawData></RawData>,
        },
      ];

      return (
        <>
          <Suitable areas={areas} no-re-click></Suitable>
          <Save />
        </>
      );
    }
  }
}

export const config = {
  name: "Home",
  layout: "painel",
  route: "/painel",
};
