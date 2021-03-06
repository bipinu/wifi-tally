/* helper so that video mixer connectors do not need to implement events */

import Channel from "../domain/Channel"
import { AppConfiguration } from "./AppConfiguration"
import ServerEventEmitter from "./ServerEventEmitter"

const haveValuesChanged = (lastArray: any, newArray: any) => {
    if(Array.isArray(lastArray) && Array.isArray(newArray)) {
        return lastArray.length !== newArray.length || lastArray.some((value, index) => value !== newArray[index])
    } else {
        return lastArray !== newArray
    }
}

export type ChannelList = string[] | null

export class MixerCommunicator {
    configuration: AppConfiguration
    emitter: ServerEventEmitter
    currentPrograms: ChannelList
    currentPreviews: ChannelList
    isConnected: boolean | null
    
    constructor(configuration: AppConfiguration, emitter: ServerEventEmitter) {
        this.configuration = configuration
        this.emitter = emitter

        this.currentPrograms = null
        this.currentPreviews = null
        this.isConnected = null
    }

    private changeProgramsIfNecessary(programs: ChannelList) {
        programs = programs ? programs.map(v => v.toString()) : null
        if (haveValuesChanged(programs, this.currentPrograms)) {
            this.currentPrograms = programs
            return true
        } else {
            return false
        }
    }

    private changePreviewsIfNecessary(previews: ChannelList) {
        previews = previews ? previews.map(v => v.toString()) : null
        if (haveValuesChanged(previews, this.currentPreviews)) {
            this.currentPreviews = previews
            return true
        } else {
            return false
        }
    }

    notifyProgramPreviewChanged(programs: ChannelList, previews: ChannelList) {
        const programChanged = this.changeProgramsIfNecessary(programs)
        const previewChanged = this.changePreviewsIfNecessary(previews)
        if (previewChanged || programChanged) {
            this.emitter.emit('program.changed', { programs: this.currentPrograms, previews: this.currentPreviews })
        }
    }

    notifyProgramChanged(programs: ChannelList) {
        const programChanged = this.changeProgramsIfNecessary(programs)
        if (programChanged) {
            this.emitter.emit('program.changed', { programs: this.currentPrograms, previews: this.currentPreviews })
        }
    }

    notifyPreviewChanged(previews: ChannelList) {
        const previewChanged = this.changePreviewsIfNecessary(previews)
        if (previewChanged) {
            this.emitter.emit('program.changed', { programs: this.currentPrograms, previews: this.currentPreviews })
        }
    }

    notifyChannelNames(count?: number, names?: object) {
        if (count === null) {
            this.notifyChannels(null)
        } else {
            // empty array with `count` elements.
            // `fill` is necessary, because Array() does not fill the array with anything - not even `undefined` ¯\_(ツ)_/¯
            const range = Array(count).fill(null)
            
            const channels = range.map((_,i) => {
                const name = names && names[i+1]
                return new Channel((i+1).toString(), name)
            })

            this.notifyChannels(channels)
        }
    }

    notifyChannels(channels : Channel[] | null) {
        channels = channels || []
        if (JSON.stringify(channels.map(c => c.toJson())) !== JSON.stringify(this.configuration.getChannels().map(c => c.toJson()))) {
            this.configuration.setChannels(channels)
        }
    }

    notifyMixerIsConnected() {
        if (this.isConnected !== true) {
            this.isConnected = true
            this.emitter.emit('mixer.connected')
        }
    }

    notifyMixerIsDisconnected() {
        if (this.isConnected !== false) {
            this.isConnected = false
            this.emitter.emit('mixer.disconnected')
        }
    }

    getCurrentPrograms() {
        return this.currentPrograms
    }

    getCurrentPreviews() {
        return this.currentPreviews
    }
}
