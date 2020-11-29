import {client} from 'utils/api-client'
import {unstable_trace as trace, unstable_wrap as wrap} from 'scheduler/tracing'

import * as React from 'react'
let queues = []

setInterval(report, 5000)

function report() {
  if (!queues.length) {
    return Promise.resolve({success: true})
  }

  const queuesSend = [...queues]
  queues = []
  return client('profile', {data: queuesSend})
}

function Profiler({metaData, phases, ...props}) {
  function onRenderCallback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) {
    if (!phases || phases.includes(phase)) {
      queues.push({
        actualDuration,
        baseDuration,
        commitTime,
        id,
        interactions,
        phase,
        startTime,
        metaData,
      })
    }
  }
  return <React.Profiler onRender={onRenderCallback} {...props} />
}

export {Profiler, trace, wrap}
