const axios = require('axios')

const getDependencies = async (packageName) => {
  const { data } = await axios.get(`https://registry.npmjs.org/${packageName}/latest`)
  return data.dependencies ? Object.keys(data.dependencies) : []
}

class Node {
  constructor(value) {
    this.value = value
    this.children = []
  }

  addNode(node) {
    this.children.push(node)
    console.log(this.children)
  }
}

class Tree {
  constructor(root) {
    this.root = root
    console.log(root)
  }

  breadthFirstSearch() {
    if (!this.root) {
      return []
    }
    const results = []
    const queue = [this.root]
    while (queue.length > 0) {
      const node = queue.shift()
      results.push(node.value)
      if (node.children.length > 0) {
        queue.push(...node.children)
      }
    }
    return results
  }
}

const buildRoot = async (packageName) => {
  const root = new Node(packageName)
  const dependencies = await getDependencies(packageName)
  for (let i = 0; i < dependencies.length; i++) {
    root.addNode(await buildRoot(dependencies[i]))
  }
  return root
}

const main = async () => {
  const tree = new Tree(await buildRoot('express'))
  console.log(tree.breadthFirstSearch())
}

main()