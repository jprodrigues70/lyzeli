import { Component } from "react";
import QuestionMapper from "../../components/QuestionMapper";
import RawData from "../../components/RawData";
import Suitable from "../../components/Suitable";
import { Context } from "../../store";
import { ReactComponent as Trash } from "../../assets/trash.svg";
import Save from "../../components/Save";
import Btn from "../../components/Btn";
import DeleteModal from "../../components/DeleteModal";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export default class Home extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      deleteCurrent: false,
      loading: false,
    };
  }
  openDeleteModal = () => {
    this.setState({ deleteCurrent: true });
  };

  closeDeleteModal = () => {
    this.setState({ deleteCurrent: false });
  };

  getHeaders = () => {
    let token = localStorage.getItem("token");
    return {
      Authorization: `token ${token}`,
      accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  };

  removeDataset = () => {
    this.setState({ loading: true });
    const repo = localStorage.getItem("repo");
    const name = localStorage.getItem("name");
    const current = localStorage.getItem("current");
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .delete(
        `https://api.github.com/repos/${repo}/contents/database/${name}.json`,
        {
          headers: this.getHeaders(),
          data: {
            message: `Delete ${name}`,
            sha: current,
            committer:
              user.name && user.email
                ? {
                    name: user.name,
                    email: user.email,
                  }
                : {
                    name: "Lyzeli",
                    email: "example@email.com",
                  },
          },
        }
      )
      .then((res) => {
        this.notify("success", "Removed! Page will reload");
        localStorage.removeItem("database");
        localStorage.removeItem("current");
        localStorage.removeItem("name");
        this.setState({ loading: false });
        window.location.reload();
      })
      .finally(() => {
        this.notify("error", "Error! Please, reload.");
        this.setState({ loading: false });
        this.props.onLoadChange && this.props.onLoadChange(false);
      });
  };

  notify = (type, msg) => toast[type](msg);

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

      const rightSideOfHeader = (
        <Btn color="negative" onClick={this.openDeleteModal}>
          <Trash />
        </Btn>
      );

      return (
        <>
          {this.state.deleteCurrent && (
            <DeleteModal
              loading={this.state.loading}
              onClose={this.closeDeleteModal}
              onPositive={this.removeDataset}
            />
          )}
          <Suitable
            areas={areas}
            no-re-click
            right-side-of-header={rightSideOfHeader}
          ></Suitable>
          <Save />
          <Toaster
            position="bottom-center"
            toastOptions={{
              error: {
                style: {
                  background: "#e2aaaa",
                  fontWeight: 500,
                },
              },
            }}
          />
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
