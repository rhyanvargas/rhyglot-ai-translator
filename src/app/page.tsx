"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface TranslationResponse {
	translation: string;
	error?: string;
}

export default function Component() {
	const [text, setText] = useState("");
	const [language, setLanguage] = useState("french");
	const [translation, setTranslation] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleTranslation() {
		setLoading(true);
		try {
			const response = await fetch("/api/translate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text,
					language,
				}),
			});

			const data: TranslationResponse = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			setTranslation(data.translation);
		} catch (error) {
			console.error("Translation error:", error);
			setTranslation("An error occurred during translation");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="w-[400px] h-[150px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
					Placeholder
				</div>
				<Card className="rounded-t-none">
					<CardContent className="space-y-4 pt-6">
						<div className="space-y-2">
							<Label className="text-lg font-semibold text-blue-600">
								Text to translate ⚡
							</Label>
							<Textarea
								placeholder="How are you?"
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="min-h-[100px] resize-none"
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-lg font-semibold text-blue-600">
								Select language ⚡
							</Label>
							<RadioGroup
								value={language}
								onValueChange={setLanguage}
								className="space-y-2"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="french" id="french" />
									<Label htmlFor="french" className="flex items-center gap-2">
										French <span className="text-xl">🇫🇷</span>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="spanish" id="spanish" />
									<Label htmlFor="spanish" className="flex items-center gap-2">
										Spanish <span className="text-xl">🇪🇸</span>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="japanese" id="japanese" />
									<Label htmlFor="japanese" className="flex items-center gap-2">
										Japanese <span className="text-xl">🇯🇵</span>
									</Label>
								</div>
							</RadioGroup>
						</div>

						{translation && (
							<div className="space-y-2">
								<Label className="text-lg font-semibold text-blue-600">
									Translation
								</Label>
								<div className="p-4 rounded-lg bg-slate-100 min-h-[100px]">
									{translation}
								</div>
							</div>
						)}

						<Button
							className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
							onClick={handleTranslation}
							disabled={!text || loading}
						>
							{loading ? "Translating..." : "Translate"}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
