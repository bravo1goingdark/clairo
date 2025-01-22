import {Gauge} from "prom-client";


export let activeTranscoderGauge = new Gauge({
    name : "no_of_active_transcoder",
    help : "Current number of active video transcoder",
})