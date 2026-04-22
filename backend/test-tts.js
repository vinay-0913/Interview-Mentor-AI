const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

(async () => {
    const tts = new MsEdgeTTS();
    await tts.setMetadata("en-US-AvaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const audioStream = tts.toStream("Hello this is a test.");
    console.log("Stream successfully created:", audioStream !== null);
})();
