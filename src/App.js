import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import http from "./services/httpService";
import logger from "./services/logService";
import config from "./config.json";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

logger.init();

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    let obj = { title: "NEW", body: "New post" };
    const { data: post } = await http.post(config.apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
    toast("Added Successfully");
  };

  handleUpdate = async (post) => {
    post.title = "UPDATED";
    http.put(config.apiEndpoint + "/" + post.id, post);

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
    toast("Updated Successfully");
  };

  handleDelete = async (post) => {
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete(config.apiEndpoint + "/" + post.id);
      toast("Deleted Successfully");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This post has already been deleted!");
      }
      this.setState({ posts: originalPosts });
    }
  };

  methodWhichThrowsError = () => {
    console.log(this.state.unDefinedVariable.someProperty);
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <button className="btn btn-primary mb-2" onClick={this.handleAdd}>
          Add
        </button>
        <br />
        <button
          className="btn btn-primary"
          onClick={this.methodWhichThrowsError}
        >
          Break the world
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
