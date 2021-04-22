import { Component } from "react";
import key from "../../plugins/key";
import { Context } from "../../store";
import "./style.sass";
export default class RawData extends Component {
  static contextType = Context;

  header() {
    const table = this.context.state["database.table"];
    return (table && table.titles) || [];
  }

  body() {
    const table = this.context.state["database.table"];
    console.log(table.rows);
    return (table && table.rows) || [];
  }

  render() {
    this.body();
    return (
      <table className="c-raw-data">
        <thead>
          <tr className="c-raw-data__tr">
            <th>#</th>
            {this.header().map((item, index) => (
              <th key={index} className="c-raw-data__th">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.body().map((row, line) => (
            <tr className="c-raw-data__tr" key={key(`line-${line}`)}>
              <td className="c-raw-data__td">{line}</td>
              {row.map((column, index) => (
                <td className="c-raw-data__td" key={key(`column-${column}`)}>
                  {column}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
