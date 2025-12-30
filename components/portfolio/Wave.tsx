'use client'

import Wave from "react-wavify";

export default function WaveComponent() {
    return (
        <div className="h-full m-0" style={{ height: '150px', position: 'relative' }}>
            <Wave fill='#404040'
                paused={false}
                style={{ display: 'flex', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                options={{
                    height: 30,
                    amplitude: 80,
                    speed: 0.2,
                    points: 2,
                }}/>
            <Wave fill='#1a1a1a'
                paused={false}
                style={{ display: 'flex', position: 'absolute', top: 0, left: 0, zIndex: 2 }}
                options={{
                    height: 40,
                    amplitude: 80,
                    speed: 0.25,
                    points: 2,
                }}/>
        </div>
    );
}
