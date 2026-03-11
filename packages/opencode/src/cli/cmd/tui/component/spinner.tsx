import { Show, createSignal, onCleanup } from "solid-js"
import { useTheme } from "../context/theme"
import { useKV } from "../context/kv"
import type { JSX } from "@opentui/solid"
import type { RGBA } from "@opentui/core"

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

export function AnimatedSpinner(props: { frames: string[]; interval: number; color: RGBA }) {
  const [frameIndex, setFrameIndex] = createSignal(0)

  const interval = setInterval(() => {
    setFrameIndex((i) => (i + 1) % props.frames.length)
  }, props.interval)

  onCleanup(() => clearInterval(interval))

  return <text fg={props.color}>{props.frames[frameIndex()]}</text>
}

export function Spinner(props: { children?: JSX.Element; color?: RGBA }) {
  const { theme } = useTheme()
  const kv = useKV()
  const color = () => props.color ?? theme.textMuted
  return (
    <Show when={kv.get("animations_enabled", true)} fallback={<text fg={color()}>⋯ {props.children}</text>}>
      <box flexDirection="row" gap={1}>
        <AnimatedSpinner frames={frames} interval={80} color={color()} />
        <Show when={props.children}>
          <text fg={color()}>{props.children}</text>
        </Show>
      </box>
    </Show>
  )
}
