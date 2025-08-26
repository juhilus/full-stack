const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { default: expect } = require('expect')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObj = helper.initialBlogs.map(blog => new Blog(blog))
  const pArr = blogObj.map(blog => blog.save())
  await Promise.all(pArr)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Specific identifider for blogs is named id', async () => {
  const start = await helper.blogsInDb()
  const blogToView = start[0]
  const resultBlog = await api
  .get(`/api/blogs/${blogToView.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  expect(resultBlog).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 5
}

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const ctt = blogsAtEnd.map(n => n.title)
  expect(ctt).toContain('TDD harms architecture')
})

test('a blog with no likes gets likes property', async () => {
    const newBlog = {
      title: "TDD HAAAAAAAA",
      author: "Robert C. Martinnnn",
      url: "QQQQhttp://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
  }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const contents = blogsAtEnd.map((n) => n.likes)
    expect(contents).toContain(0)
  })

test('blog without title is not added', async () => {
  const newBlog = {
    url: "https://EITOIMI",
    author: "NAAAHH"
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
    const newBlog = {
      title: 'EIIIIIII',
      author: "NAAAHH"
    }
  
    await api.post('/api/blogs').send(newBlog).expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})


test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})