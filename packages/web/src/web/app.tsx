import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Admin from "./pages/admin";
import Checkout from "./pages/checkout";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/pedido" component={Checkout} />
        <Route path="/admin" component={Admin} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
