'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Github, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

const techTags = [
  { label: 'Real-Time Chat', color: 'bg-teal-100 text-teal-800' },
  { label: 'Smart File Tagging', color: 'bg-indigo-100 text-indigo-800' },
  { label: 'Assignment Manager', color: 'bg-rose-100 text-rose-800' },
  { label: 'Dark Mode UI', color: 'bg-slate-100 text-slate-800' },
  { label: 'Export to PDF/Excel', color: 'bg-orange-100 text-orange-800' },
  { label: 'Search & Filter', color: 'bg-lime-100 text-lime-800' },
  { label: 'GraphQL Backend', color: 'bg-purple-100 text-purple-800' },
  { label: 'WebSocket Realtime DB', color: 'bg-yellow-100 text-yellow-800' },
]

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 ">
      <Card className="bg-accent/40 shadow-xl border-muted">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            About Notes Mania
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-base leading-relaxed">
          <p>
            <span className="font-semibold text-foreground">Notes Mania</span> is a productivity-focused
            academic platform that enables students to seamlessly share notes, manage assignments, and
            communicate in real time—all in one place.
          </p>
          <p>
            The inspiration behind Notes Mania came from the struggle students face juggling between
            different platforms like WhatsApp, Drive, and personal folders. Here, everything is
            centralized, searchable, and beautifully organized.
          </p>
          <p>
            Built for speed and simplicity, it combines powerful tech like Firebase and GraphQL with
            a delightful UI using Next.js, TailwindCSS, and ShadCN components.
          </p>
          <p>
            Whether you&apos;re managing semester assignments, sharing notes with your batchmates, or chatting
            with group members—all of it happens with ease inside Notes Mania.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {techTags.map((tag, idx) => (
              <span
                key={idx}
                className={clsx(
                  'rounded-full px-3 py-1 text-sm font-medium',
                  tag.color
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/30 border-muted shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Meet the Creator</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>
            I&apos;m <span className="font-semibold text-foreground">Krishna Saini</span>, an engineering student at IIT BHU and a self-taught full-stack web developer. I created Notes Mania to bring clarity, structure, and collaboration into students’ lives.
          </p>
          <p>
            From designing the UI and coding real-time group chat to implementing tag filters, PDF exports, and assignment trackers—I’ve poured my energy into building a tool students will actually use.
          </p>
          <p>
            The project is still evolving with new ideas like AI note summarization, better notification systems, and deep integrations with campus tools in the pipeline.
          </p>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild>
              <a href="https://github.com/krishna-notesmania" target="_blank">
                <Github className="w-4 h-4 mr-2" /> GitHub
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="/contact">
                <MessageSquare className="w-4 h-4 mr-2" /> Contact Me
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-accent/20 border-muted shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">AI-Powered Interactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-base">
          <p>
            Inspired by the smooth and intuitive experience of <span className="text-foreground font-medium">ChatGPT</span>,
            Notes Mania includes an AI-powered assistant that helps students quickly get answers, generate summaries, and brainstorm academic content.
          </p>
          <p>
            What makes it unique is the ability to <span className="text-foreground font-medium">select specific text from previous AI replies</span> and ask deeper or follow-up questions, just like a real-time academic conversation.
          </p>
          <p>
            This AI module is built to help with:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Summarizing large notes or lectures</li>
            <li>Clearing doubts based on selected content</li>
            <li>Suggesting improvements in assignments</li>
            <li>Personalized academic assistance</li>
          </ul>

          <div className="mt-4 px-4 py-2 bg-gradient-to-br from-muted via-accent to-background border border-border rounded-xl text-sm text-muted-foreground shadow-inner">
            Example: Select a paragraph in a note → Right click → Ask AI → Instantly get a summarized or follow-up explanation.
          </div>
        </CardContent>
      </Card>


      <Separator />

      <div className="text-center text-sm text-muted-foreground">
        Built with ❤️ using modern web tech to solve student problems.
      </div>
    </div>
  )
}

export default AboutPage
