"use client"

import { useEffect, useState, useRef } from "react"

const TREES = [
  <svg key={0} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="135" rx="14" ry="4" fill="#8B5A2B" opacity={0.25} />
    <path d="M57 132 Q55 134 54 135" stroke="#8B5A2B" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M63 132 Q65 134 66 135" stroke="#8B5A2B" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M60 132 Q59 116 60 107" stroke="#7CB342" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="52" cy="116" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(-35 52 116)" />
    <ellipse cx="68" cy="116" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(35 68 116)" />
    <ellipse cx="54" cy="112" rx="5" ry="2.5" fill="#52B788" transform="rotate(-20 54 112)" />
    <ellipse cx="66" cy="112" rx="5" ry="2.5" fill="#52B788" transform="rotate(20 66 112)" />
    <g transform="translate(60, 105)">
      <circle cx="0" cy="-2.5" r="2" fill="#FFB5C2" />
      <circle cx="-2.5" cy="0" r="2" fill="#FFB5C2" />
      <circle cx="2.5" cy="0" r="2" fill="#FFB5C2" />
      <circle cx="0" cy="2.5" r="2" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.2" fill="#E9C46A" />
    </g>
  </svg>,
  <svg key={1} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="133" rx="22" ry="5" fill="#8B5A2B" opacity={0.3} />
    <path d="M52 130 Q44 133 40 135" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M68 130 Q76 133 80 135" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M56 131 Q53 133 52 134" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M64 131 Q67 133 68 134" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M60 130 L60 80" stroke="#A98467" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M60 108 Q48 102 38 96" stroke="#A98467" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M60 98 Q72 92 82 88" stroke="#A98467" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M60 88 Q55 82 50 78" stroke="#A98467" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="35" cy="94" rx="8" ry="4" fill="#52B788" transform="rotate(-25 35 94)" />
    <ellipse cx="40" cy="98" rx="6" ry="3" fill="#95D5B2" transform="rotate(-40 40 98)" />
    <ellipse cx="32" cy="90" rx="5" ry="3" fill="#2D6A4F" transform="rotate(-15 32 90)" />
    <ellipse cx="86" cy="86" rx="8" ry="4" fill="#52B788" transform="rotate(25 86 86)" />
    <ellipse cx="80" cy="90" rx="6" ry="3" fill="#95D5B2" transform="rotate(40 80 90)" />
    <ellipse cx="88" cy="82" rx="5" ry="3" fill="#2D6A4F" transform="rotate(15 88 82)" />
    <ellipse cx="60" cy="75" rx="12" ry="7" fill="#2D6A4F" />
    <ellipse cx="52" cy="72" rx="8" ry="5" fill="#52B788" transform="rotate(-15 52 72)" />
    <ellipse cx="68" cy="72" rx="8" ry="5" fill="#95D5B2" transform="rotate(15 68 72)" />
    <ellipse cx="46" cy="68" rx="5" ry="3" fill="#95D5B2" transform="rotate(-25 46 68)" />
    <ellipse cx="74" cy="68" rx="5" ry="3" fill="#52B788" transform="rotate(25 74 68)" />
    <g transform="translate(36, 92)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFB5C2" />
      <circle cx="-3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="3" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(48, 70)">
      <circle cx="0" cy="-2.5" r="2" fill="#FF8FAB" />
      <circle cx="-2.5" cy="0" r="2" fill="#FF8FAB" />
      <circle cx="2.5" cy="0" r="2" fill="#FF8FAB" />
      <circle cx="0" cy="2.5" r="2" fill="#FF8FAB" />
      <circle cx="0" cy="0" r="1.2" fill="#E9C46A" />
    </g>
  </svg>,
  <svg key={2} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="135" rx="28" ry="6" fill="#8B5A2B" opacity={0.3} />
    <path d="M48 131 Q38 134 32 136" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M72 131 Q82 134 88 136" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M54 132 Q49 134 46 135" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M66 132 Q71 134 74 135" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M56 130 L56 60" stroke="#A98467" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M56 105 Q40 96 28 88" stroke="#8B5A2B" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M56 90 Q72 80 88 74" stroke="#8B5A2B" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M56 75 Q46 66 38 60" stroke="#8B5A2B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M56 68 Q68 58 80 54" stroke="#8B5A2B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M28 88 Q24 84 22 80" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M88 74 Q94 70 96 66" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="24" cy="84" rx="10" ry="5" fill="#2D6A4F" transform="rotate(-20 24 84)" />
    <ellipse cx="28" cy="90" rx="8" ry="4" fill="#52B788" transform="rotate(-40 28 90)" />
    <ellipse cx="20" cy="78" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(-10 20 78)" />
    <ellipse cx="92" cy="72" rx="10" ry="5" fill="#2D6A4F" transform="rotate(20 92 72)" />
    <ellipse cx="86" cy="76" rx="8" ry="4" fill="#52B788" transform="rotate(40 86 76)" />
    <ellipse cx="98" cy="64" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(10 98 64)" />
    <ellipse cx="34" cy="56" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(-15 34 56)" />
    <ellipse cx="40" cy="60" rx="7" ry="3.5" fill="#52B788" transform="rotate(-35 40 60)" />
    <ellipse cx="84" cy="52" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(15 84 52)" />
    <ellipse cx="78" cy="56" rx="7" ry="3.5" fill="#52B788" transform="rotate(35 78 56)" />
    <ellipse cx="56" cy="52" rx="16" ry="10" fill="#2D6A4F" />
    <ellipse cx="46" cy="48" rx="10" ry="6" fill="#52B788" transform="rotate(-20 46 48)" />
    <ellipse cx="66" cy="48" rx="10" ry="6" fill="#95D5B2" transform="rotate(20 66 48)" />
    <ellipse cx="40" cy="42" rx="7" ry="4" fill="#95D5B2" transform="rotate(-30 40 42)" />
    <ellipse cx="72" cy="42" rx="7" ry="4" fill="#52B788" transform="rotate(30 72 42)" />
    <ellipse cx="56" cy="38" rx="5" ry="3" fill="#95D5B2" />
    <g transform="translate(24, 82)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFB5C2" />
      <circle cx="-3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="3" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(94, 70)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFB5C2" />
      <circle cx="-3.5" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="3.5" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="3.5" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(56, 36)">
      <circle cx="0" cy="-3" r="2.5" fill="#FF8FAB" />
      <circle cx="-3" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="3" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="3" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
  </svg>,
  <svg key={3} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="136" rx="34" ry="7" fill="#8B5A2B" opacity={0.3} />
    <path d="M42 132 Q30 135 22 138" stroke="#8B5A2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M78 132 Q90 135 98 138" stroke="#8B5A2B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M50 133 Q44 136 40 137" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M70 133 Q76 136 80 137" stroke="#8B5A2B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M52 132 L52 45" stroke="#8B5A2B" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M52 105 Q34 94 20 82" stroke="#6B4226" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M52 88 Q70 76 88 68" stroke="#6B4226" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M52 72 Q38 60 26 52" stroke="#6B4226" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M52 60 Q66 48 82 44" stroke="#6B4226" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M20 82 Q14 78 10 72" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M88 68 Q96 62 100 58" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M26 52 Q20 46 18 40" stroke="#6B4226" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M82 44 Q90 38 94 34" stroke="#6B4226" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M52 50 Q56 42 60 36" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="16" cy="78" rx="12" ry="6" fill="#1B4332" transform="rotate(-25 16 78)" />
    <ellipse cx="22" cy="84" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(-45 22 84)" />
    <ellipse cx="10" cy="70" rx="8" ry="4" fill="#52B788" transform="rotate(-15 10 70)" />
    <ellipse cx="6" cy="64" rx="6" ry="3" fill="#95D5B2" transform="rotate(-30 6 64)" />
    <ellipse cx="92" cy="66" rx="12" ry="6" fill="#1B4332" transform="rotate(25 92 66)" />
    <ellipse cx="86" cy="70" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(45 86 70)" />
    <ellipse cx="102" cy="56" rx="8" ry="4" fill="#52B788" transform="rotate(15 102 56)" />
    <ellipse cx="106" cy="50" rx="6" ry="3" fill="#95D5B2" transform="rotate(30 106 50)" />
    <ellipse cx="22" cy="48" rx="10" ry="5" fill="#1B4332" transform="rotate(-20 22 48)" />
    <ellipse cx="28" cy="52" rx="7" ry="3.5" fill="#2D6A4F" transform="rotate(-40 28 52)" />
    <ellipse cx="14" cy="38" rx="6" ry="3" fill="#52B788" transform="rotate(-10 14 38)" />
    <ellipse cx="86" cy="42" rx="10" ry="5" fill="#1B4332" transform="rotate(20 86 42)" />
    <ellipse cx="80" cy="46" rx="7" ry="3.5" fill="#2D6A4F" transform="rotate(40 80 46)" />
    <ellipse cx="96" cy="32" rx="6" ry="3" fill="#52B788" transform="rotate(10 96 32)" />
    <ellipse cx="52" cy="38" rx="18" ry="12" fill="#1B4332" />
    <ellipse cx="40" cy="34" rx="12" ry="8" fill="#2D6A4F" transform="rotate(-20 40 34)" />
    <ellipse cx="64" cy="34" rx="12" ry="8" fill="#52B788" transform="rotate(20 64 34)" />
    <ellipse cx="34" cy="28" rx="8" ry="5" fill="#52B788" transform="rotate(-30 34 28)" />
    <ellipse cx="70" cy="28" rx="8" ry="5" fill="#95D5B2" transform="rotate(30 70 28)" />
    <ellipse cx="52" cy="24" rx="6" ry="4" fill="#95D5B2" />
    <g transform="translate(16, 76)">
      <circle cx="0" cy="-3.5" r="3" fill="#FFB5C2" />
      <circle cx="-3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="3.5" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.8" fill="#E9C46A" />
    </g>
    <g transform="translate(102, 54)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFB5C2" />
      <circle cx="-3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="3" cy="0" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="3" r="2.5" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(56, 22)">
      <circle cx="0" cy="-3" r="2.5" fill="#FF8FAB" />
      <circle cx="-3" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="3" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="3" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(28, 50)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFC4D9" />
      <circle cx="-3.5" cy="0" r="2.5" fill="#FFC4D9" />
      <circle cx="3.5" cy="0" r="2.5" fill="#FFC4D9" />
      <circle cx="0" cy="3.5" r="2.5" fill="#FFC4D9" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <circle cx="36" cy="63" r="3.5" fill="#E9C46A" opacity={0.9} />
    <circle cx="72" cy="52" r="3" fill="#F4A261" opacity={0.9} />
  </svg>,
  <svg key={4} viewBox="0 0 120 140" style={{ width: 144, height: 144 }}>
    <ellipse cx="60" cy="138" rx="38" ry="8" fill="#8B5A2B" opacity={0.3} />
    <path d="M36 134 Q22 138 14 140" stroke="#8B5A2B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M84 134 Q98 138 106 140" stroke="#8B5A2B" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M46 135 Q38 138 34 139" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M74 135 Q82 138 86 139" stroke="#8B5A2B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 134 L50 38" stroke="#6B4226" strokeWidth="12" strokeLinecap="round" fill="none" />
    <path d="M50 110 Q30 96 14 82" stroke="#5C3A21" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M50 90 Q70 76 92 66" stroke="#5C3A21" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M50 72 Q34 58 20 48" stroke="#5C3A21" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M50 56 Q68 42 86 36" stroke="#5C3A21" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M14 82 Q6 76 2 68" stroke="#5C3A21" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M92 66 Q100 60 106 54" stroke="#5C3A21" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M20 48 Q12 40 8 34" stroke="#5C3A21" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M86 36 Q96 28 102 22" stroke="#5C3A21" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M50 42 Q42 32 38 24" stroke="#5C3A21" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M50 60 Q56 50 62 42" stroke="#5C3A21" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M50 80 Q62 68 72 58" stroke="#5C3A21" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M50 100 Q38 90 28 82" stroke="#5C3A21" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="8" cy="78" rx="14" ry="7" fill="#1B4332" transform="rotate(-30 8 78)" />
    <ellipse cx="14" cy="84" rx="10" ry="5" fill="#2D6A4F" transform="rotate(-50 14 84)" />
    <ellipse cx="2" cy="66" rx="9" ry="4.5" fill="#52B788" transform="rotate(-20 2 66)" />
    <ellipse cx="-2" cy="58" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(-35 -2 58)" />
    <ellipse cx="96" cy="64" rx="14" ry="7" fill="#1B4332" transform="rotate(30 96 64)" />
    <ellipse cx="90" cy="68" rx="10" ry="5" fill="#2D6A4F" transform="rotate(50 90 68)" />
    <ellipse cx="108" cy="52" rx="9" ry="4.5" fill="#52B788" transform="rotate(20 108 52)" />
    <ellipse cx="114" cy="44" rx="7" ry="3.5" fill="#95D5B2" transform="rotate(35 114 44)" />
    <ellipse cx="16" cy="44" rx="12" ry="6" fill="#1B4332" transform="rotate(-25 16 44)" />
    <ellipse cx="22" cy="48" rx="8" ry="4" fill="#2D6A4F" transform="rotate(-45 22 48)" />
    <ellipse cx="6" cy="32" rx="7" ry="3.5" fill="#52B788" transform="rotate(-15 6 32)" />
    <ellipse cx="90" cy="34" rx="12" ry="6" fill="#1B4332" transform="rotate(25 90 34)" />
    <ellipse cx="84" cy="38" rx="8" ry="4" fill="#2D6A4F" transform="rotate(45 84 38)" />
    <ellipse cx="104" cy="20" rx="7" ry="3.5" fill="#52B788" transform="rotate(15 104 20)" />
    <ellipse cx="34" cy="22" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(-20 34 22)" />
    <ellipse cx="66" cy="20" rx="9" ry="4.5" fill="#2D6A4F" transform="rotate(20 66 20)" />
    <ellipse cx="50" cy="30" rx="22" ry="14" fill="#1B4332" />
    <ellipse cx="36" cy="26" rx="14" ry="9" fill="#2D6A4F" transform="rotate(-25 36 26)" />
    <ellipse cx="64" cy="26" rx="14" ry="9" fill="#52B788" transform="rotate(25 64 26)" />
    <ellipse cx="28" cy="18" rx="9" ry="6" fill="#52B788" transform="rotate(-35 28 18)" />
    <ellipse cx="72" cy="18" rx="9" ry="6" fill="#95D5B2" transform="rotate(35 72 18)" />
    <ellipse cx="50" cy="14" rx="7" ry="5" fill="#95D5B2" />
    <ellipse cx="44" cy="10" rx="4" ry="3" fill="#D8F3DC" transform="rotate(-15 44 10)" />
    <ellipse cx="56" cy="10" rx="4" ry="3" fill="#D8F3DC" transform="rotate(15 56 10)" />
    <g transform="translate(6, 74)">
      <circle cx="0" cy="-4" r="3.5" fill="#FFB5C2" />
      <circle cx="-4" cy="0" r="3.5" fill="#FFB5C2" />
      <circle cx="4" cy="0" r="3.5" fill="#FFB5C2" />
      <circle cx="0" cy="4" r="3.5" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="2" fill="#E9C46A" />
    </g>
    <g transform="translate(108, 50)">
      <circle cx="0" cy="-3.5" r="3" fill="#FFB5C2" />
      <circle cx="-3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="3.5" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.8" fill="#E9C46A" />
    </g>
    <g transform="translate(50, 12)">
      <circle cx="0" cy="-3.5" r="3" fill="#FF8FAB" />
      <circle cx="-3.5" cy="0" r="3" fill="#FF8FAB" />
      <circle cx="3.5" cy="0" r="3" fill="#FF8FAB" />
      <circle cx="0" cy="3.5" r="3" fill="#FF8FAB" />
      <circle cx="0" cy="0" r="1.8" fill="#E9C46A" />
    </g>
    <g transform="translate(14, 42)">
      <circle cx="0" cy="-3" r="2.5" fill="#FFC4D9" />
      <circle cx="-3" cy="0" r="2.5" fill="#FFC4D9" />
      <circle cx="3" cy="0" r="2.5" fill="#FFC4D9" />
      <circle cx="0" cy="3" r="2.5" fill="#FFC4D9" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <g transform="translate(88, 32)">
      <circle cx="0" cy="-3.5" r="3" fill="#FFB5C2" />
      <circle cx="-3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="3.5" cy="0" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="3.5" r="3" fill="#FFB5C2" />
      <circle cx="0" cy="0" r="1.8" fill="#E9C46A" />
    </g>
    <g transform="translate(34, 20)">
      <circle cx="0" cy="-3" r="2.5" fill="#FF8FAB" />
      <circle cx="-3.5" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="3.5" cy="0" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="3.5" r="2.5" fill="#FF8FAB" />
      <circle cx="0" cy="0" r="1.5" fill="#E9C46A" />
    </g>
    <circle cx="30" cy="58" r="4" fill="#E9C46A" opacity={0.9} />
    <circle cx="78" cy="48" r="3.5" fill="#F4A261" opacity={0.9} />
    <circle cx="60" cy="42" r="3" fill="#E9C46A" opacity={0.9} />
    <circle cx="20" cy="30" r="3" fill="#F4A261" opacity={0.9} />
    <circle cx="100" cy="28" r="3" fill="#E9C46A" opacity={0.9} />
  </svg>,
]

interface TreeAnimationProps {
  points: number
}

const STAGES = [
  { threshold: 0, label: "Seed", emoji: "🌰", nextThreshold: 50 },
  { threshold: 50, label: "Sprout", emoji: "🌱", nextThreshold: 150 },
  { threshold: 150, label: "Sapling", emoji: "🌿", nextThreshold: 350 },
  { threshold: 350, label: "Growing", emoji: "🌳", nextThreshold: 700 },
  { threshold: 700, label: "Fully Grown", emoji: "🌲", nextThreshold: Infinity },
]

export default function TreeAnimation({ points }: TreeAnimationProps) {
  const stage = points >= 700 ? 4 : points >= 350 ? 3 : points >= 150 ? 2 : points >= 50 ? 1 : 0
  const s = STAGES[stage]
  const next = s.nextThreshold
  const progress = next === Infinity ? 1 : (points - s.threshold) / (next - s.threshold)
  const clampedProgress = Math.max(0, Math.min(1, progress))

  const [growing, setGrowing] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const prevStageRef = useRef(stage)

  useEffect(() => {
    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage
      setGrowing(true)
      const timer = setTimeout(() => setGrowing(false), 1200)
      const flowerColors = ["#FFB5C2", "#FF8FAB", "#FFC4D9", "#FFB5C2", "#FF9EBB"]
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 10 + Math.random() * 50,
        delay: Math.random() * 0.4,
      }))
      setSparkles(newSparkles)
      setTimeout(() => setSparkles([]), 2000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes treeGrow {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1.5deg); }
        }
        @keyframes sparkleFade {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          30% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes flowerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      <div style={{ position: "relative", width: 144, height: 144 }}>
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            style={{
              position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`,
              width: 10 + Math.random() * 8, height: 10 + Math.random() * 8,
              borderRadius: "50%", pointerEvents: "none",
              background: Math.random() > 0.5
                ? "radial-gradient(circle, #E9C46A, #F4A261)"
                : "radial-gradient(circle, #FFB5C2, #FF8FAB)",
              animation: `sparkleFade 1.2s ease-out forwards`,
              animationDelay: `${sp.delay}s`,
            }}
          />
        ))}
        <div
          style={{
            transformOrigin: "bottom center",
            animation: growing ? "treeGrow 1.2s ease-out forwards" : "treeSway 4s ease-in-out infinite",
            width: 144, height: 144,
          }}
        >
          {TREES[stage]}
        </div>
      </div>

      <p style={{ marginTop: 4, fontSize: 14, fontWeight: 500, color: "var(--emerald)" }}>
        {s.emoji} {s.label}
      </p>

      {next !== Infinity && (
        <div style={{ marginTop: 8, width: "100%", maxWidth: 140 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--grey-400)", marginBottom: 4 }}>
            <span>{points} pts</span>
            <span>{next} pts</span>
          </div>
          <div style={{ height: 6, width: "100%", borderRadius: 99, background: "var(--grey-200)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg, var(--emerald), var(--mint))",
                width: `${Math.round(clampedProgress * 100)}%`,
                transition: "width 0.7s ease-out",
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
