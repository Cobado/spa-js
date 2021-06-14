import Dashboard from "./views/Dashboard.js";
import Customers from "./views/Customers.js";
import CustomerView from "./views/CustomerView.js";
import Statistics from "./views/Statistics.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
    console.log(pathToRegex("posts/:id"));
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/customers", view: Customers },
        { path: "/customers/:id", view: CustomerView },
        { path: "/statistics", view: Statistics }
    ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
        route: route,
        result: location.pathname.match(pathToRegex(route.path))
    };
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

    const view = new match.route.view(getParams(match));

  document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
