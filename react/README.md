# react
React v14 and up is supported.

## Run
#### Prod (Cloud Run)
gcloud builds submit --config=cloudbuild.yaml  
gcloud run deploy --image gcr.io/sales-engineering-sf/wcap-flask --platform managed

#### Dev (docker-compose)
1. docker-compose up --build

#### Dev (docker containers individually)
1. docker build --build-arg SENTRY_AUTH_TOKEN=1234567 -t react:2.0 .
2. docker build --build-arg SENTRY_AUTH_TOKEN=1234567 -t react:2.0 -f Dockerfile.dev .

or from project root:
1. docker build --build-arg SENTRY_AUTH_TOKEN=8c3eaf4784e84978ab9aaae9b789dc5ecf9fbd362af343c7ba8bfbce9eec12f3 -t react:2.1 -f ./react/Dockerfile.dev .
2. docker run <image_name> --rm --name=react -p 5000:5000

#### Multi-stage Build 
Can build it first `npm run deploy` then put static asset in the Dockerfile/build, this way only 1 build going on in docker  

Can run the web build `npm run deploy` inside of the the docker container  

https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217  
https://dev.to/peterj/run-a-react-app-in-a-docker-container-kjn  
[Explain tracingOrigins and CORS](https://github.com/getsentry/sentry-docs/pull/1556/commits/4fb9cbaee016c0bffe95ab7277ef526b759c9cac)

# Knowledge for @sentry/apm @sentry/react

Resources (Performance Entries, which include CSS?) and Requests (XHR)

## XHR'S
Tracing integration does itself. Sentry doesn't take it from a Performance Entry, because these PE's are not supported on every browser, and Breadcrumbs capture them anyways.

## @sentry/apm
Requests and Resources are the main thing tracked. This will get replaced by `@sentry/tracing`.

2 Main web operations that are tracked by the sdk, which tries to put max amount of info in event as possible.
1. Pageload - includes assets, bundles. Performance Entries, Requests, resources.
2. Navigation - pushing history, going to diff page. SPA's. rendering diff routes, URL changes. sdk tracks history as can vary between browsers. May not be a Transaction by itself necesarilly, could appear as bc/span under a transaction?

You can have a Transaction representing a Pageload. But you probably won't have a Transaction representing a Navigation alone. Rather, a Transaction may include Navigation data. ?

## @sentry/apm with Tracing Integration
Example:
```
integrations: [
    new Integrations.Tracing({
        tracingOrigins: tracingOrigins
    }),
],
```

In theory, you could skip using the Tracing Integration, and instrument everything yourself using just @sentry/apm (via .startSpan and other library methods).

## Performance Entries 
Performance Entries are captured by @sentry/apm's Tracing Integration itself.

[Performance Entries defined by Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType)

### Browsers
"Browsers generate performance entries [e.g. for navigations] which sentry sdk selects from the browser's API. The SDK decides what it thinks are most accurate/useful. The SDK grabs as much info from the API is possible. If the browser doesn't expose it something, then the sdk can't get it"

Browser - spans from API to the browser, unloadEvent, happen before JS is executed on the page Performance Marks, Measures, Browser Events + req/resp, Images, CSS

https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry#:~:text=A%20performance%20entry%20can%20be,(such%20as%20an%20image).


### Resource
Also from browser's API. We'll be collecting more of this info in the future

https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming

- It's easy to underestimate the RESOURCES you load on your site'
- Resources can be up to 40% of the tx's duration.
- Can get 'did not fetch errors' with the Measures/BrwoserEvents
- Trace Context attached if happened during a Tx
- e.g. fetching JSON or an image
- You can look for change in Resources loaded, between releases.
- Resource (Images/CSS) Performance Entries are more important than Browser Performance Entries
- If cached, then page loads faster. Sentry is working on informing you if the page served was Cached or not for the particular pageload/transaction.

### Mark
The time it took Sentry sdk to initialize   
https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark  
SentryTracing.init shows when Tracinig was initialized

`performance.mark()` you can call yourself, and it will appear in the trace view. This also works in Node as it's a javascript API.

`performance.measure()`

If you already have marks and measures, sentry sdk will pick them up. We still recommend using Spans instead because those are associated with errors as well.

### Paint
Css and what's finally ainted on the screen.

## @sentry/react 
```
// wraps around @/sentry/browser
import * as Sentry from '@sentry/react'; 
```

### Components
- Responsible for making `react.mount` `.update` to appear for the Component. Same if you were to use Angular, Vue.
- react.render span if the Component is unmounted (e.g. LoadingIndicator loads and finishes. or a skeleton component displays while content loads)

@sentry-react tracks updates passed into the app, like props (React).

```
export default connect(
  mapStateToProps,
  { addTool, resetCart, setTools }
)(Sentry.withProfiler(App, { name: "ToolStore"})) 
```

### DOM Updates
If React's DOM updates and lifecycles. Then the Profiler will run on it. Sentry calls it 'Profiler' because it's similar as [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)  

If you don't pass the `{ name }` param below then you'll get a value of  `<T>` for the Component's span you're viewing in the UI, because value because it takes from minified js asset. Passing { name: "ToolStore"} makes sure it gets included into the static build:

### @sentry/tracing
Exposes new API's for custom routing implementation. Route changes are normally captured via breadcrumbs, but now you get control over when pageloads+navigations are created, and it still appears in bc's. The sdk's integrations will use this API. Don't expect users to need it. But it's good if the user has a very custom or lesser known web framework.

## Other
"pointed timespans"

^ is component based
anything important for your transactions. pageloads. 
"most important pageloads". 
top-level app component. 
vs. 
drill down to individual subcomponent. 
vs.  
"updates of a component receiving new data".  
vs. 
loadingIndicators, loadingState. 
'it's essentialy a wrapper around startSpan stopSpan'.

"when all activities are done" SPA.
specificy an idle timeout, to extend this...
based on heuristics.  
1 Browser metrics/resoureces.
2 HXR's.
3 Components.

load projects but navigate to a new URL....then sdk stops plageload TX, w/ tx status cancelled
when navigation occurs, start a new transactions.
user going to newTab cancels transaction.
^ all these are configurable - "great defaults that worked really work at Senttry forus, and our customers so far".
try to never lose the info (context/scope).

maxTransaction exceeded so gets set as Status/time exceeded.

heuristics  
https://knowledge.broadcom.com/external/article/19516/understanding-heuristics-baselines-in-in.html

Option - normalizeDepth: 10 // Or however deep you want your state context to be.

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optional - https://docs.sentry.io/platforms/javascript/react/integrations/redux/#redux-enhancer-options
});