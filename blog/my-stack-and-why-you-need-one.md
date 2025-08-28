---
date: 2025-08-22
author: Jake Berg
title: "My Stack and Why You Need One"
description: "Discover how a modern, serverless-first tech stack with React Router V7, Vercel, UploadThing, Turso, and Drizzle ORM can transform your development workflow and enable effortless scaling."
---

# My Stack and Why You Need One

In the ever-evolving landscape of web development, choosing the right technology stack can make or break your project's success. After years of experimentation and building various applications, I've settled on a stack that not only meets today's needs but is built for tomorrow's challenges. Let me walk you through my current setup and explain why it might be exactly what you need too.

## The Stack Breakdown

### React Router V7 as a Framework
React Router V7 represents a significant evolution in the React ecosystem. It's not just a routing library anymore—it's a full-fledged framework that provides the foundation for modern React applications. The key advantage here is its enhanced support for server-side rendering and data loading patterns that work well in serverless environments.

React Router V7 introduces improved data loading capabilities and better integration with modern React patterns like Suspense and concurrent features. While it doesn't specifically assume serverless environments, its design patterns and data loading strategies work exceptionally well when deployed to serverless platforms where each request might be handled by a different instance.

### Vercel for Deployment
Vercel has revolutionized how we think about deployment. The magic happens when you push to your repository—your code is automatically built, tested, and deployed to a global CDN. There's no server management, no configuration headaches, and no scaling concerns.

The beauty of Vercel's approach is that it's not just about ease of deployment; it's about the entire development workflow. You get preview deployments for every pull request, automatic HTTPS, and global edge caching out of the box. The cost structure is also incredibly favorable—you pay for what you use, and for most projects, that means very little.

### UploadThing for File Uploads
File uploads are notoriously complex to implement correctly. UploadThing abstracts away all the complexity of handling file uploads, providing a simple API that works seamlessly with your frontend. It handles file validation, storage, and CDN distribution automatically.

What makes UploadThing particularly valuable in a serverless environment is that it doesn't require you to maintain any server-side state or handle the complexities of multipart form data processing. Your serverless functions can focus on business logic while UploadThing handles the file management.

### Turso for Databases
Turso brings the power of SQLite to the cloud with a serverless-first approach. It's built on top of libSQL, which is a fork of SQLite designed for distributed environments. This means you get the simplicity and reliability of SQLite with the scalability and availability of a cloud database.

The integration with Drizzle ORM is particularly powerful because it allows you to write type-safe database queries while maintaining the performance benefits of SQLite. Turso's edge replication ensures your data is available globally with minimal latency.

### Drizzle ORM with @libsql/client
Drizzle ORM is a modern, type-safe ORM that's designed to work with SQLite and other databases. The integration with @libsql/client is crucial because it provides the connection layer that allows Drizzle to work with Turso's cloud instances.

This setup gives you the best of both worlds: the developer experience of a modern ORM with the performance and reliability of SQLite. The type safety ensures you catch errors at compile time rather than runtime, which is invaluable in a serverless environment where debugging can be challenging.

## The Serverless Advantage

### Stateless by Design
The most important aspect of this stack is that it's completely decoupled from state. Every piece of your application can run in isolation without depending on shared memory or persistent connections. This is crucial for serverless environments where your code might be running on different machines or even different continents.

When your application is stateless, scaling becomes trivial. You can add new instances without worrying about session management, shared state, or data consistency issues. Each request is handled independently, which means your application can handle traffic spikes gracefully.

### Horizontal Scaling Made Simple
Traditional applications often require complex orchestration when scaling horizontally. You need load balancers, session management, and careful consideration of how state is shared between instances. With a serverless-first approach, these concerns disappear.

Your code is designed to run in isolated environments from the start, so when you need to scale, you simply deploy more instances. The infrastructure handles the routing and load balancing automatically. This is true whether you're running on Vercel's serverless functions or your own Kubernetes cluster.

### Cost Efficiency
Serverless environments are incredibly cost-effective for most applications. You pay only for the compute time you actually use, which means you can start with virtually zero cost and scale up as your application grows. This is particularly valuable for side projects, MVPs, and applications with variable traffic patterns.

Even for applications with consistent traffic, the operational overhead of managing servers often outweighs the cost savings of traditional hosting. When you factor in the time spent on server maintenance, security updates, and scaling operations, serverless becomes an obvious choice.

## Why This Matters for Everyone

### From Hobby Projects to Enterprise
You might think this stack is overkill for a simple blog with three hits per month, but that's exactly the point. The beauty of this setup is that it scales from zero to millions of users without requiring any architectural changes.

For a small blog, you get the benefits of global CDN distribution, automatic HTTPS, and zero server management. As your audience grows, the same infrastructure can handle the increased load without any modifications. You don't need to worry about server capacity, database connections, or scaling strategies.

### Developer Experience
The developer experience with this stack is exceptional. You can focus on building features rather than managing infrastructure. The deployment process is so seamless that it becomes invisible—you push code and it's live in seconds.

The type safety provided by Drizzle ORM and TypeScript integration means you catch errors early in the development process. The hot reloading and development tools make the development cycle incredibly fast.

### Future-Proof Architecture
Technology evolves rapidly, and the last thing you want is to be locked into an architecture that becomes obsolete. This stack is built on open standards and modern practices that will remain relevant for years to come.

React Router V7 is designed to work with future React features and server-side rendering patterns. The serverless approach is becoming the standard for modern web applications. SQLite and libSQL are battle-tested technologies that will continue to evolve and improve.

## Getting Started

The best part about this stack is that you can get started immediately. All of these tools have excellent documentation and starter templates. You can have a fully functional application deployed in minutes, not days or weeks.

Start with a simple project—maybe a blog or a todo app—and experience the workflow firsthand. You'll quickly see how the serverless-first approach changes how you think about application architecture and deployment.

## Conclusion

Your technology stack is more than just a collection of tools; it's a statement about how you approach software development. A serverless-first, stateless architecture isn't just about technical benefits—it's about building applications that can grow and evolve without architectural debt.

Whether you're building a personal blog or the next billion-dollar application, this stack provides the foundation you need to succeed. The combination of developer experience, cost efficiency, and scalability makes it an excellent choice for projects of any size.

The future of web development is serverless, stateless, and globally distributed. This stack puts you at the forefront of that future, giving you the tools you need to build applications that can scale from zero to millions of users without breaking a sweat.

So, what are you waiting for? Start building with this stack today and experience the difference that a modern, serverless-first approach can make in your development workflow.
