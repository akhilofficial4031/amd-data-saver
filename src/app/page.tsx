"use client";

import { useState, ChangeEvent } from "react";

// Define types for our data structure
interface CallToAction {
  name: string;
  link: string;
}

interface LinkCard {
  title: string;
  link: string;
}

interface LinkBlock {
  title: string;
  subTitle: string;
  link: string;
}

interface SectionDescription {
  paragraph1: string;
  paragraph2: string;
  bulletPoints: string[];
}

interface Section {
  headingLight: string;
  headingBold: string;
  description: SectionDescription;
  image: string;
}

interface FormDataType {
  heroImage: string;
  headingLight: string;
  headingBold: string;
  callToActions: CallToAction[];
  sections: Section[];
  isLinkCards: boolean;
  isLinkBlocks: boolean;
  linkCards: LinkCard[];
  linkBlocks: LinkBlock[];
}

// Add global styles for form inputs
const inputStyles = "w-full p-2 border border-black rounded placeholder-gray-600";
const textareaStyles = "w-full p-2 border border-black rounded placeholder-gray-600";
const inputWithButtonStyles = "w-full p-2 border border-black rounded-l placeholder-gray-600";

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Dental Data Form</h1>
      <DentalDataForm />
    </main>
  );
}

function DentalDataForm() {
  const [formName, setFormName] = useState<string>("");
  const [bulletPointsText, setBulletPointsText] = useState<string[]>([""]);
  const [formData, setFormData] = useState<FormDataType>({
    heroImage: "",
    headingLight: "",
    headingBold: "",
    callToActions: [
      {
        name: "",
        link: "",
      }
    ],
    sections: [
      {
        headingLight: "",
        headingBold: "",
        description: {
          paragraph1: "",
          paragraph2: "",
          bulletPoints: [],
        },
        image: "",
      },
    ],
    isLinkCards: false,
    isLinkBlocks: false,
    linkCards: [
      {
        title: "",
        link: "",
      }
    ],
    linkBlocks: [
      {
        title: "",
        subTitle: "",
        link: "",
      }
    ],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    section: "root" | "callToActions" | "sections" | "linkCards" | "linkBlocks", 
    field: string, 
    index: number | null = null, 
    nestedField: "description" | "bulletPoints" | null = null
  ) => {
    const { value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (section === "root") {
        (newData as any)[field] = value;
      } else if (section === "callToActions" && index !== null) {
        (newData.callToActions[index] as any)[field] = value;
      } else if (section === "sections" && index !== null) {
        if (nestedField) {
          if (nestedField === "description") {
            (newData.sections[index].description as any)[field] = value;
          } else if (nestedField === "bulletPoints" && typeof index === "number") {
            newData.sections[index].description.bulletPoints[field as unknown as number] = value;
          }
        } else {
          (newData.sections[index] as any)[field] = value;
        }
      } else if (section === "linkCards" && index !== null) {
        (newData.linkCards[index] as any)[field] = value;
      } else if (section === "linkBlocks" && index !== null) {
        (newData.linkBlocks[index] as any)[field] = value;
      }
      
      return newData;
    });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  const handleBulletPointsTextChange = (e: ChangeEvent<HTMLTextAreaElement>, sectionIndex: number) => {
    const { value } = e.target;
    
    // Update the raw text array
    const newBulletPointsText = [...bulletPointsText];
    // Ensure the array has enough elements
    while (newBulletPointsText.length <= sectionIndex) {
      newBulletPointsText.push("");
    }
    newBulletPointsText[sectionIndex] = value;
    setBulletPointsText(newBulletPointsText);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddCallToAction = () => {
    setFormData(prev => ({
      ...prev,
      callToActions: [...prev.callToActions, { name: "", link: "" }]
    }));
  };

  const handleRemoveCallToAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      callToActions: prev.callToActions.filter((_, i) => i !== index)
    }));
  };

  const handleAddLinkCard = () => {
    setFormData(prev => ({
      ...prev,
      linkCards: [...prev.linkCards, { title: "", link: "" }]
    }));
  };

  const handleRemoveLinkCard = (index: number) => {
    setFormData(prev => ({
      ...prev,
      linkCards: prev.linkCards.filter((_, i) => i !== index)
    }));
  };

  const handleAddLinkBlock = () => {
    setFormData(prev => ({
      ...prev,
      linkBlocks: [...prev.linkBlocks, { title: "", subTitle: "", link: "" }]
    }));
  };

  const handleRemoveLinkBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      linkBlocks: prev.linkBlocks.filter((_, i) => i !== index)
    }));
  };

  const handleAddSection = () => {
    setBulletPointsText(prev => [...prev, ""]);
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          headingLight: "",
          headingBold: "",
          description: {
            paragraph1: "",
            paragraph2: "",
            bulletPoints: [],
          },
          image: "",
        }
      ]
    }));
  };

  const handleRemoveSection = (sectionIndex: number) => {
    setBulletPointsText(prev => prev.filter((_, i) => i !== sectionIndex));
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex)
    }));
  };

  const downloadJson = () => {
    // Process the form data to parse bullet points before downloading
    const processedData = { ...formData };
    
    // Process each section's bullet points
    processedData.sections = formData.sections.map((section, index) => {
      // Get the raw text for this section
      const rawText = bulletPointsText[index] || "";
      
      // Parse the bullet points
      const bulletPoints = rawText
        .replace(/•/g, ',') // Replace bullet characters with commas
        .split(',') // Split by comma
        .map(item => item.trim())
        .filter(item => item !== '');
      
      // Return the updated section
      return {
        ...section,
        description: {
          ...section.description,
          bulletPoints
        }
      };
    });

    const dataStr = JSON.stringify(processedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Use the form name for the file name, or default to 'dental-data' if empty
    const fileName = formName.trim() ? 
      formName.trim().replace(/\s+/g, '-').toLowerCase() + '.json' : 
      'dental-data.json';
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">File Name</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name (for the JSON file)
          </label>
          <input
            type="text"
            value={formName}
            onChange={handleNameChange}
            className="w-full p-2 border rounded"
            placeholder="Enter name for the JSON file (e.g. missing-teeth-treatment)"
          />
          <p className="text-sm text-gray-500 mt-1">
            This name will be used for the downloaded JSON file and will not be included in the data.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => handleChange(e, "root", "heroImage")}
              className="w-full p-2 border rounded"
              placeholder="Enter image path (e.g. /images/hero.webp)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading Light
              </label>
              <input
                type="text"
                value={formData.headingLight}
                onChange={(e) => handleChange(e, "root", "headingLight")}
                className="w-full p-2 border rounded"
                placeholder="Light weight heading text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading Bold
              </label>
              <input
                type="text"
                value={formData.headingBold}
                onChange={(e) => handleChange(e, "root", "headingBold")}
                className="w-full p-2 border rounded"
                placeholder="Bold weight heading text"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Call To Actions</h2>
        {formData.callToActions.map((cta, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={cta.name}
                onChange={(e) => handleChange(e, "callToActions", "name", index)}
                className="w-full p-2 border rounded"
                placeholder="Enter CTA name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={cta.link}
                  onChange={(e) => handleChange(e, "callToActions", "link", index)}
                  className="w-full p-2 border rounded-l"
                  placeholder="Enter CTA link"
                />
                {formData.callToActions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCallToAction(index)}
                    className="bg-red-500 text-white px-3 rounded-r"
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCallToAction}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Add Call To Action
        </button>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sections</h2>
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Section
          </button>
        </div>
        
        {formData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 pb-6 border-b relative">
            <div className="absolute top-0 right-0">
              {formData.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sectionIndex)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove Section
                </button>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4 mt-2">Section {sectionIndex + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Light
                </label>
                <input
                  type="text"
                  value={section.headingLight}
                  onChange={(e) => handleChange(e, "sections", "headingLight", sectionIndex)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter light heading"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Bold
                </label>
                <input
                  type="text"
                  value={section.headingBold}
                  onChange={(e) => handleChange(e, "sections", "headingBold", sectionIndex)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter bold heading"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="text"
                value={section.image}
                onChange={(e) => handleChange(e, "sections", "image", sectionIndex)}
                className="w-full p-2 border rounded"
                placeholder="Enter image path"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paragraph 1
              </label>
              <textarea
                value={section.description.paragraph1}
                onChange={(e) => handleChange(e, "sections", "paragraph1", sectionIndex, "description")}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter first paragraph"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paragraph 2
              </label>
              <textarea
                value={section.description.paragraph2}
                onChange={(e) => handleChange(e, "sections", "paragraph2", sectionIndex, "description")}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter second paragraph"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bullet Points
              </label>
              <textarea
                value={bulletPointsText[sectionIndex] || ""}
                onChange={(e) => handleBulletPointsTextChange(e, sectionIndex)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter bullet points separated by commas or bullet points (•)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter each bullet point separated by commas or bullet points (•)
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Link Options</h2>
        
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLinkCards"
              name="isLinkCards"
              checked={formData.isLinkCards}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="isLinkCards" className="text-sm font-medium text-gray-700">
              Show Link Cards
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLinkBlocks"
              name="isLinkBlocks"
              checked={formData.isLinkBlocks}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="isLinkBlocks" className="text-sm font-medium text-gray-700">
              Show Link Blocks
            </label>
          </div>
        </div>
        
        {formData.isLinkCards && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Link Cards</h3>
            {formData.linkCards.map((card, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleChange(e, "linkCards", "title", index)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter card title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={card.link}
                      onChange={(e) => handleChange(e, "linkCards", "link", index)}
                      className="w-full p-2 border rounded-l"
                      placeholder="Enter card link"
                    />
                    {formData.linkCards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkCard(index)}
                        className="bg-red-500 text-white px-3 rounded-r"
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLinkCard}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Link Card
            </button>
          </div>
        )}
        
        {formData.isLinkBlocks && (
          <div>
            <h3 className="text-lg font-medium mb-3">Link Blocks</h3>
            {formData.linkBlocks.map((block, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 mb-4 pb-4 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => handleChange(e, "linkBlocks", "title", index)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter block title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={block.subTitle}
                    onChange={(e) => handleChange(e, "linkBlocks", "subTitle", index)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter block subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={block.link}
                      onChange={(e) => handleChange(e, "linkBlocks", "link", index)}
                      className="w-full p-2 border rounded-l"
                      placeholder="Enter block link"
                    />
                    {formData.linkBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkBlock(index)}
                        className="bg-red-500 text-white px-3 rounded-r"
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLinkBlock}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Link Block
            </button>
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={downloadJson}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-lg"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
}
