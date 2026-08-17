import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, repo, branch, content } = body;

    const ghToken = token || process.env.NEXT_PUBLIC_GITHUB_PAT;
    const ghRepo = repo || process.env.NEXT_PUBLIC_GITHUB_REPO || "Farazjafri5/sajid-delhi-dairy";
    const ghBranch = branch || process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

    if (!ghToken) {
      return NextResponse.json(
        { error: "GitHub Personal Access Token is missing." },
        { status: 400 }
      );
    }

    // 1. Prepare UTF-8 Base64 content
    const base64Content = Buffer.from(content, "utf-8").toString("base64");

    // 2. Fetch current file SHA from GitHub
    const fileUrl = `https://api.github.com/repos/${ghRepo}/contents/src/data/siteContent.ts?ref=${ghBranch}`;
    const getRes = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Delhi-Diaries-App",
      },
      cache: "no-store",
    });

    let sha = "";
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 3. Commit updated file to GitHub repo
    const putRes = await fetch(
      `https://api.github.com/repos/${ghRepo}/contents/src/data/siteContent.ts`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Delhi-Diaries-App",
        },
        body: JSON.stringify({
          message: "CMS Update from Delhi Diaries Admin Dashboard",
          content: base64Content,
          branch: ghBranch,
          ...(sha ? { sha } : {}),
        }),
      }
    );

    if (putRes.ok) {
      return NextResponse.json({
        success: true,
        message: "Successfully committed to GitHub! Vercel is now deploying your live site.",
      });
    } else {
      const err = await putRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "GitHub API rejected commit." },
        { status: putRes.status }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
