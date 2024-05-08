import {useState, useEffect}  from 'react';
import 'aframe';
import { Entity, Scene } from 'aframe-react';
import * as THREE from 'three';

function HandTrackingScene() {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [lastHandRotation, setLastHandRotation] = useState(null);

    useEffect(() => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            sceneEl.addEventListener('trackingupdated', (evt) => {
                const hand = evt.detail.hand;
                if (hand) {
                    setLastHandRotation(new THREE.Euler().fromArray(hand.rotation));
                }
            });
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const sceneEl = document.querySelector('a-scene');
            const hand = sceneEl?.systems['tracked-controls-webxr']?.getController(0);
            if (hand && hand.pose) {
                const handRotation = new THREE.Euler().fromArray(hand.pose.orientation);
                if (lastHandRotation) {
                    const deltaY = handRotation.y - lastHandRotation.y;
                    setRotation(prevRotation => ({
                        ...prevRotation,
                        y: prevRotation.y + THREE.Math.radToDeg(deltaY)
                    }));
                    setLastHandRotation(handRotation);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [lastHandRotation]);

    return (
        <Scene oculus-hand-tracking>
            <a-assets>
                <img id="starrySky" src="starrySkyTexture.webp"/>
                <img id="auroraTexture" src="auroraTexture.webp"/>
                <img id="woodTexture" src="woodTexture.webp"/>
                <img id="sandTexture" src="sandTexture.webp"/>
                <img id="marbleTexture" src="marbleTexture.webp"/>
            </a-assets>
            
            <Entity primitive="a-sky" src="#starrySky" />

            <Entity light="type: ambient; color: #555" />
            <Entity light="type: directional; castShadow: true; intensity: 0.5" position="-2 4 -4" />

            <Entity primitive="a-plane" src="#auroraTexture" position="0 5 -10" rotation="0 0 0" material={{side: 'double', transparent: true, opacity: 0.8}} />

            <Entity primitive="a-box" src="#woodTexture" position="0 1 -3" rotation="0 0 0" width="2" height="0.5" depth="1" />

            <Entity primitive="a-box" src="#sandTexture" position="0 1.3 -3" rotation="0 0 0" width="1.5" height="0.2" depth="1" />

            <Entity primitive="a-sphere" src="#marbleTexture" position="0 1.35 -3" radius="0.05" repeat="5" spread="0.1"/>

            <Entity primitive="a-box" position="0 1.5 -2" rotation={rotation} color="#4CC3D9" />
        </Scene>
    );
}

export default HandTrackingScene;
