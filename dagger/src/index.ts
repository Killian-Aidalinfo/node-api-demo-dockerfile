import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
export class NodeApiDemo {

  @func()
  build(source: Directory): Container {
    const devDirectory = this.dev(source)
    return dag
      .container()
      .withDirectory("/app", devDirectory)
      .build(devDirectory,{dockerfile: "Dockerfile"})
  }


  @func()
  dev(source: Directory): Directory {
    const nodeCache = dag.cacheVolume("node")
    const npmInstall = dag
        .container()
        // start from a base Node.js container
        .from("node:lts")
        // add the source code at /src
        .withDirectory("/app", source)
        // mount the cache volume at /root/.npm
        .withMountedCache("/root/.npm", nodeCache)
        // change the working directory to /src
        .withWorkdir("/app")
        // run npm install to install dependencies
        .withExec(["npm", "install"])
    // Return directory
    return npmInstall.directory("/app")
  }

}
