"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Smile } from "lucide-react"

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  trigger?: React.ReactNode
}

const EMOJI_CATEGORIES = {
  reactions: ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'],
  smileys: ['😀', '😃', '😄', '😁', '😅', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍'],
  gestures: ['👋', '🤚', '✋', '🖐️', '👌', '🤌', '✌️', '🤞', '👏', '🙌', '👐', '🤲'],
  symbols: ['✅', '❌', '⭐', '💯', '💪', '🚀', '💡', '📚', '🎯', '⏰', '📝', '✨']
}

export function EmojiPicker({ onSelect, trigger }: EmojiPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2" align="end">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Reactions</p>
            <div className="flex flex-wrap gap-1">
              {EMOJI_CATEGORIES.reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Smileys</p>
            <div className="flex flex-wrap gap-1">
              {EMOJI_CATEGORIES.smileys.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Gestures</p>
            <div className="flex flex-wrap gap-1">
              {EMOJI_CATEGORIES.gestures.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Symbols</p>
            <div className="flex flex-wrap gap-1">
              {EMOJI_CATEGORIES.symbols.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function QuickReactions({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="flex gap-0.5 bg-background border rounded-full px-1 py-0.5 shadow-lg">
      {EMOJI_CATEGORIES.reactions.slice(0, 6).map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-sm hover:scale-110"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
