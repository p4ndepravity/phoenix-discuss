defmodule Discuss.UserController do
  use Discuss.Web, :controller
  alias Discuss.User

  def show(conn, _params) do
    user = User
      |> Repo.get(conn.assigns.user.id)
      |> Repo.preload(:topics)

    IO.inspect(user)
    render conn, "show.html", user: user
  end
end
