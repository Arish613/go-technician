"use client"
import { useState } from "react";

export function ServiceContent({ html, maxHeight = 300 }: { html: string; maxHeight?: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div
                className="blog-content transition-all duration-300"
                style={
                    expanded
                        ? {}
                        : {
                            maxHeight,
                            overflow: "hidden",
                            position: "relative",
                        }
                }
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {!expanded && (
                <div className="text-center mt-4">
                    <button
                        className="text-blue-600 underline font-medium"
                        onClick={() => setExpanded(true)}
                        type="button"
                    >
                        Read more
                    </button>
                </div>
            )}
            {expanded && (
                <div className="text-center mt-4">
                    <button
                        className="text-blue-600 underline font-medium"
                        onClick={() => setExpanded(false)}
                        type="button"
                    >
                        Show less
                    </button>
                </div>
            )}
        </div>
    );
}