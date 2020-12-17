import { useState, useEffect } from 'react';
import {socket} from './useSocket'
import ConfigTracker from './tracker/config'
import VmixConfiguration from '../mixer/vmix/VmixConfiguration';
import ObsConfiguration from '../mixer/obs/ObsConfiguration';
import MockConfiguration from '../mixer/mock/MockConfiguration';
import AtemConfiguration from '../mixer/atem/AtemConfiguration';

const configTracker = new ConfigTracker(socket)

export function useMixerNameConfiguration() {
  const [mixerName, setMixerName] = useState(configTracker.mixerName)

  const onChange = newMixerName => {
    setMixerName(newMixerName)
  }

  useEffect(() => {
    configTracker.on("mixer", onChange)
    return () => {
      // cleanup
      configTracker.off("mixer", onChange)
    }
  })

  return mixerName
}

export function useAtemConfiguration() {
  const [atemConfiguration, setAtemConfiguration] = useState<AtemConfiguration|undefined>(undefined)

  const onChange = newConf => {
    setAtemConfiguration(newConf)
  }

  useEffect(() => {
    configTracker.on("atem", onChange)
    setAtemConfiguration(configTracker.atemConfiguration)
    return () => {
      // cleanup
      configTracker.off("atem", onChange)
    }
  })

  return atemConfiguration
}

export function useMockConfiguration() {
  const [mockConfiguration, setMockConfiguration] = useState<MockConfiguration|undefined>(undefined)

  const onChange = newConf => {
    setMockConfiguration(newConf)
  }

  useEffect(() => {
    configTracker.on("mock", onChange)
    setMockConfiguration(configTracker.mockConfiguration)
    return () => {
      // cleanup
      configTracker.off("mock", onChange)
    }
  })

  return mockConfiguration
}

export function useObsConfiguration() {
  const [obsConfiguration, setObsConfiguration] = useState<ObsConfiguration|undefined>(undefined)

  const onChange = newConf => {
    setObsConfiguration(newConf)
  }

  useEffect(() => {
    configTracker.on("obs", onChange)
    setObsConfiguration(configTracker.obsConfiguration)
    return () => {
      // cleanup
      configTracker.off("obs", onChange)
    }
  })

  return obsConfiguration
}

export function useVmixConfiguration() {
  const [vmixConfiguration, setVmixConfiguration] = useState<VmixConfiguration|undefined>(undefined)

  const onChange = newConf => {
    setVmixConfiguration(newConf)
  }

  useEffect(() => {
    configTracker.on("vmix", onChange)
    setVmixConfiguration(configTracker.vmixConfiguration)
    return () => {
      // cleanup
      configTracker.off("vmix", onChange)
    }
  })

  return vmixConfiguration
}