import { useState, useEffect } from 'react';
import {socket} from './useSocket'
import MixerTracker from './tracker/mixer'

const mixerTracker = new MixerTracker(socket)

// the hook
function useMixerInfo() {
  const [isMixerConnected, setIsMixerConnected] = useState(mixerTracker.connectionState)

  useEffect(() => {
    const onConnectionChange = (isConnected: boolean) => {
      setIsMixerConnected(isConnected)
    }
    mixerTracker.on("connection", onConnectionChange)
    return () => {
      // cleanup
      mixerTracker.off("connection", onConnectionChange)
    }
  }, [])

  return isMixerConnected
}

export default useMixerInfo
