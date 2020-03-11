import React from "react"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    width: "1em",
    height: "1em",
    fontSize: 24,
    fill: "currentColor",
  },
}))

export default function ScoresIcon({ color, ...props }) {
  const classes = useStyles()
  return (
    <svg
      className={clsx("icon", classes.root)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="8.81122"
          y1="-18.3031"
          x2="8.81122"
          y2="41.0827"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#075ED2" />
          <stop offset="1" stopColor="#04164F" />
        </linearGradient>
      </defs>
      <path
        d="M5.24 13.9558H6.80203V20.0199H5.24V13.9558Z"
        fill={color}
      />
      <path
        d="M13.212 5.96533H14.774V20.02H13.212V5.96533Z"
        fill={color}
      />
      <path
        d="M17.198 13.9558H18.76V20.0199H17.198V13.9558Z"
        fill={color}
      />
      <path
        d="M10.788 5.96533H9.22598V20.02H10.788V5.96533Z"
        fill={color}
      />
      <path
        d="M7.233 9.53955H8.79503V20.02H7.233V9.53955Z"
        fill={color}
      />
      <path
        d="M15.205 9.53955H16.767V20.02H15.205V9.53955Z"
        fill={color}
      />
      <path
        d="M12.781 4.15991H11.219V20.0199H12.781V4.15991Z"
        fill={color ? color : "url(#paint0_linear)"}
      />
    </svg>
  )
}
