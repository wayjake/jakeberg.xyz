---
date: 2026-10-21
author: Jake Berg
title: "On the Keeping of Gates: App Stores and the Price of Permission"
description: "A complaint about the two companies that decide what runs on our phones, what their gates cost the people who build software, and a proposal: free listing, a short application, and progressive web apps admitted as the native apps they already are."
image: "/blog/covers/on-the-keeping-of-gates.jpg"
---

I am at present building two applications, and I would prefer that they be native. I have been in this trade long enough to know the difference between a program that lives on a machine and one that only visits it. The code is not the difficulty. The code comes in an afternoon, or a week, and it does what I ask of it. The difficulty is a gate I did not build, kept by two companies I have never met, who require that I explain myself before they will let me hand a small, useful thing to my neighbor.

Most people believe the phone in their pocket is theirs. They paid for it, they carry it, and they sleep beside it. But it is theirs the way a rented room is theirs: you may hang a picture, but you may not move a wall, and the landlord keeps a key. There are, for every practical purpose, two landlords. Between them they hold nearly every pocket in the country, and they have arranged things so that a program reaches one of those pockets only by passing through their hands.

## The ledger

Thoreau kept careful accounts of what his cabin cost him, down to the half-cent, so that no one could say he had exaggerated. I will try to do the same with what it costs one person to be permitted to ship a program.

- To Apple, ninety-nine dollars a year, every year, for membership. Let it lapse and your apps come down off the shelf. Schools, charities, and governments may ask to have the fee waived. A person who means to give a program away pays it in full.
- To both, if you enroll as a business, a D-U-N-S number: an identifier issued by a credit-reporting firm, so that one corporation may be assured by another that you exist.
- To Apple, a drawer full of certificates. A signing request to obtain a certificate, a certificate to sign a profile, a profile bound to an App ID, an App ID bound to a team ID and a bundle identifier, and a device identifier for every phone you would like to test on. Each has a number. Most of them expire. None of them tells you which of the others it is waiting for.
- To both, a gallery of pictures: screenshots cut to the sizes each store demands, icons, banners, a description, a privacy questionnaire, all made fresh for each shelf. A program may not be published until it has also been advertised.
- To Google, twenty-five dollars, once. I will grant that this is closer to honest. But a new personal account must then find twelve testers who stay opted in for fourteen unbroken days before it may even ask to be published. Ask anyone who has tried to keep twelve friends interested in anything for fourteen days.
- To both, a review by a stranger who decides whether the program may pass. I will say for the review that it is no longer slow. It is the one item on this list I would keep.
- To Apple, thirty percent of what you sell inside the program, or fifteen if you are small enough to be pitied.

None of these is ruinous on its own. That is the trick of it. A toll is never ruinous; it is merely always there.

## On testing

There is one more cost that never appears on an invoice, and it is the one that wears on me most. It is the ordeal of simply trying the thing.

On the web I change a line, reload, and hand a friend a link. On a phone, to put a build in front of anyone but myself, I must all but publish it. On Apple's side the build goes up through the same console a release goes through, with a description and notes for a reviewer, and before an outside tester may touch it, a stranger reviews the beta. On Google's side it goes into a testing track in the console, and a new account cannot reach the public until twelve testers have waited out their fourteen days. To show a friend what I made on Tuesday, I am asked to perform a small launch, with paperwork. In practice one launches the store to test the program, and so one tests less, and ships later, and ships worse.

## On security

I will grant what deserves granting. Signing a program ties it to someone who can be found. Review catches some malware and a good deal of fraud. The sandboxes these companies built are honest, careful engineering, and I would not take them away from anyone. I have no quarrel with the sandbox. My quarrel is with the turnstile they have placed in front of it and called a lock.

Ninety-nine dollars does not make a program safe. It makes it paid for. Twelve testers do not find a vulnerability; they find twelve obliging acquaintances. A number from a credit bureau says nothing about whether my code reads your contacts. These are not locks. They are fare boxes, and a fare box secures only the one collecting the fares.

Anyone who has browsed either store knows the gate does not keep out every rogue. What it keeps out, mostly, is the poor and the impatient. A company with a compliance department treats the whole affair as overhead. A single builder with an idea on a Tuesday treats it as a wall, and very often goes home.

I could build real apps faster than I do. I am not slowed by the language, or the frameworks, or the hardware. I am slowed by the permission, and the permission is granted in the name of security.

## The open one narrows

For years the reply to all of this was that Android was the open alternative. If Apple would not have you, you could hand someone a file and they could install it, as people have installed programs since there were programs.

That is changing. Google has announced that apps on certified Android phones must come from developers it has verified, and that in time this will reach apps installed from outside its own store. The first enforcement began this September, in Brazil, Indonesia, Singapore, and Thailand, and only through participating stores. The rest of the world is promised for 2027. For those who still want an unverified app, Google has built a path: turn on developer mode, swear you are not being coerced, restart the phone, wait a day, and authenticate again. In my youth one double-clicked.

So the choice between a walled garden and an open field is becoming, slowly, a choice between two walled gardens with slightly different gates.

## What it costs the trade

The fees are small. The cost is not the fees. The cost is everything that is never built.

There is a whole class of software that ought to exist and mostly does not: the app for one team's season, one family's chores, one school's play, one day's outing. Programs with forty users, built in a weekend, used for a month, and then let go. These are the programs a person makes for the people around them, and they are exactly the ones the gate turns away, because no one will pay a yearly membership and recruit a dozen testers for a thing that lives a month.

So those programs become websites, or they become nothing. And the industry learns, a little at a time, that native software is for companies large enough to afford the gate, and the web is for everyone else. The two keepers are not fools. They have learned what every bridge-keeper in history knew: when yours is the only bridge, you need not keep it in good repair.

## A racket, plainly named

Consider the whole arrangement from a little distance.

The keepers of the market are also its largest merchants. Their own maps, music, mail, notes, and weather are on the phone before you ever open the store, and they need no screenshots, no certificates, and no twelve testers to get there. Every program that does pass the gate competes with the gatekeeper's own goods, on the gatekeeper's own shelf, under the gatekeeper's own rules.

Then, of every sale a program makes inside itself, the keeper takes a share. And for years the rules forbade a developer even to tell a customer that the same thing could be bought more cheaply elsewhere. It took a federal court to make Apple let American developers send their customers to their own checkout, and Apple has carried that fight as far as the Supreme Court rather than let it rest.

Build the town, own the only road into it, open the biggest shop on the square, take a cut of every other shop's sales, and forbid them from mentioning that there is a market in the next town over. In the plain speech of my grandfather's day, that is a racket: a business that charges you for safe passage through a danger it put there.

## The web already solved this

Here is what galls me most. The problem the gate claims to solve was solved years ago, and solved in the open.

A progressive web app runs inside the browser's sandbox, which is the most attacked and most hardened piece of software most people own. It asks permission before it touches the camera, the location, or the notifications. It updates without a review queue. It can be installed to the home screen and opened like anything else, and it can work offline.

On the iPhone, Apple permits this the way a landlord permits a tenant's cat: grudgingly, and without mentioning it. You must know to open the Share menu and find Add to Home Screen, a place no ordinary person has ever gone on purpose. In 2024 Apple moved to remove home-screen web apps for its users in the European Union, and relented only after an outcry. There is no way to submit a web app to the App Store as itself. You must wrap it in a native shell and hope the reviewer does not decide it is "merely a website."

Others have shown this is not hard. The Microsoft Store lists progressive web apps. Google Play will take one wrapped as a Trusted Web Activity, once you prove you own the site. The thing can be done. It is not done because it is not wanted.

## What I would ask

I do not ask that the gates come down. I am old enough to know they will not. I ask only that they be kept honestly, and I would put it in three parts.

First, make listing free. Charge on sales if you must; a percentage of nothing is nothing, and that is fair. But do not charge a person for permission to give a thing away, and do not forbid my customer from paying me by some other door.

Second, ask for no more than is required. A name, a way to reach me when something goes wrong, one key to sign with, and an honest statement of what the program touches. Keep the review; it is quick, and it is the honest part. Let me hand a test build to a friend with a link. Let the screenshots be optional, and let the program speak for itself. Everything past that is ceremony.

Third, admit the progressive web app as the native app it already is. Let me submit a URL and a manifest. List it on the same shelf, beside everything else, with the same permission prompts and the same notifications and the same icon on the same home screen. The sandbox is already built. It has been built for years.

I do not ask to be let in because I am clever. I ask because the thing I made is small and useful, my neighbor wants it, and I would like to hand it over the fence without first paying whoever claims to own the fence. Until then I will go on building for the web, which still belongs to no one, and is the better for it.

[Part 2](/blog/on-the-keeping-of-gates-part-2) walks the rest of the wall: Android, the carriers, and the phone itself.
