"use server";

import { connectToDB } from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null
  });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`)
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();
  
    const skipAmount = (pageNumber - 1) * pageSize;
  
    const postResults = Thread.find({ 
      parentId: { $in: [null, undefined] } 
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
  
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
  
    const posts = await postResults.exec();
  
    const isNext = totalPostsCount > skipAmount + posts.length;
  
    return { posts, isNext };
  }

export async function fetchThreadById(id: string) {
  connectToDB();

  try {

    const thread = await Thread.findById(id)
    // TODO: Populate the community
    .populate({
      path: "author",
      model: User,
      select: "_id id name image"
    })
    .populate({
      path: "children",
      populate: [
        {
          path: "author",
          model: User,
          select: "_id id parentId name image"
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "_id id parentId name image"
          }
        }
      ]
    }).exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string, 
  commentText: string, 
  userId: string, 
  path: string
) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found!");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);

  } catch (error: any) {
    throw new Error(`Failed to post comment: ${error.message}`);
  }
}