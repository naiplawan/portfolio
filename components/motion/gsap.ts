'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin)

/**
 * Media query every motion asset runs under. Without it (reduced motion, or no JS)
 * the server-rendered final frame stays on screen.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/** Frame-by-frame easing for the 8-bit look. */
export const stepped = (frames: number) => `steps(${frames})`

export { gsap, ScrollTrigger, useGSAP }
