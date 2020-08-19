# react

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

## Knowledgebase @sentry/apm @sentry/react

Requests and Resources!!!

then...performance marks + measures. Kevan. 

### @sentry/tracing
Exposes new API's for custom routing implementation.
Route changes normally captured via breadcrumbs,

Control over when pageloads+navigations are created. still appear in bc's.

Our integrations will use this API. Don't expect users to need it. It's good though if user has a very custom/lesser-known web framework (not vue/react/angular).

#### XHR'S
Tracing integration does itself. Sentry doesn't take it from Performance Entry, because these PE's not supported on every browser, and Breadcrumbs use it already.

### @sentry/apm
1. Pageload - includes assets, bundles. Performance Entries
2. Navigation - pushing history, going to diff page. SPA's. rendering diff routes, URL changes. sdk tracks history as can vary between browsers.  
^ the 2 surfing the web operations  
^ we track both  

- SDK trying to put max amount of info in event as possible.

#### Performance Entries 
From sentry/apm and the Tracing Integration inside the sdk.
Tracing integration
```
integrations: [
    new Integrations.Tracing({
        tracingOrigins: tracingOrigins
    }),
],
```
In theory, you could just instrument sentry/apm and NOT use integration, but still instrument everything yourself. Means everything becomes up to you.

#### BROWSERS
"Browsers generate performance entries [for navigation and other things] and sentry sdk selecting (from browser API) which it thinks are more accurate" "SDK's grab as much info from the API is possible" "if browser doesn't expose it, then sdk can't get it"

Browser - spans from API to the browser, unloadEvent, happen before JS is executed on the page Performance Marks, Measures, Browser Events + req/resp, Images, CSS

https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry#:~:text=A%20performance%20entry%20can%20be,(such%20as%20an%20image).

https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType

#### RESOURCE
also from browser's API. We'll be collecting more of this info in the future

https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming

Resource - Talking Points  
- easy to underestimate the RESOURCES you load on your site'
- ...was 40% of the tx's duration
- could have 'did not fetch errors' with the Measures/BrwoserEvents
- Trace Context attached if happened during a Tx
- fetching JSON or an image
- Look for change in Resources loaded, between releases.
- Resource (Images/CSS) PE's more important than Browser performance entries
- If cached, then things load faster. we're working on informing you that Cache was at play or not in the particular pageload/transaction. 

#### MARK
The time it took Sentry sdk to initialize   
https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark  
SentryTracing.init shows when Tracinig was initialized

`performance.mark()` they can call themselves, and will appear in the trace view
works in Node and the Browser (b/c is a js api)

`performance.measure()`

If you already have marks and measures, sentry sdk will pick them up. we still recommend Spans because those are associated with errors

#### PAINT
css. painted on the screen.

### @sentry/react 
Responsible for making react.mount .update appear. Same if you were to use Angular, Vue.

@sentry-react tracks updates passed into the app, like props (which is React specific).
If React's DOM updates and lifecycles. Then the Profiler will run on it. Sentry calls it 'Profiler' because it's similar as [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)  
(props - args to a function call. React.createElement w/ the props)  

```
// wraps around @/sentry/browser
import * as Sentry from '@sentry/react'; 
```

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


If you don't pass the { name } param below then you'll get a value of  `<T>` for the Component's span you're viewing in the UI, because value because it takes from minified js asset. Passing { name: "ToolStore"} makes sure it gets included into the static build:
```
export default connect(
  mapStateToProps,
  { addTool, resetCart, setTools }
)(Sentry.withProfiler(App, { name: "ToolStore"})) 
```

## Other
React v14 (is what's supported?)
(where does this go).
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



react.render span if the Component is unmounted (e.g. LoadingIndicator loads and finishes. e.g. skeleton displays while content loads)




*TODO* these ^ notes, put into the Docs, work with Fiona