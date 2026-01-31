import {
  addRepository,
  DeleteRepository,
  fetchRepositoryByType,
  fetchSubjectsByClass,
  UpdateRepository,
} from "@/app/api/adminapi/adminrepositry";
import RepositorySection from "@/components/admincomponents/RepositorySection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

export default function Repository() {
  const [repositoryData, setRepositoryData] = useState<{
    category?: any[];
    resource?: any[];
    language?: any[];
    level?: any[];
    book?: any[];
    subject?: any[];
  }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: any }>(
    {},
  );
  const [editData, setEditData] = useState<{
    type?: string;
    id?: number | null;
  }>({});

  const fetchLevelByCategory = async (categoryLabel: string) => {
    try {
      const levelRes = await fetchRepositoryByType("level", categoryLabel);

      if (!levelRes?.success || !Array.isArray(levelRes.data)) {
        setRepositoryData((prev) => ({ ...prev, level: [] }));
        return;
      }

      setRepositoryData((prev) => ({
        ...prev,
        level: levelRes.data.map((item: any) => ({
          label: item.text,
          value: item.id,
          category: item.category,
        })),
      }));
    } catch {
      setRepositoryData((prev) => ({ ...prev, level: [] }));
    }
  };

  const fetchRepository = async () => {
    try {
      const [category, resource, language] = await Promise.all([
        fetchRepositoryByType("category"),
        fetchRepositoryByType("resource"),
        fetchRepositoryByType("language"),
      ]);
      if (resource.success && language.success) {
        setRepositoryData((prev) => ({
          ...prev,
          category: category.data.map((item: any) => ({
            label: item.text,
            value: item.id,
          })),
          resource: resource.data.map((item: any) => ({
            label: item.text,
            value: item.id,
          })),
          language: language.data.map((item: any) => ({
            label: item.text,
            value: item.id,
          })),
        }));
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Unexpected API format.",
          button: "Try Again",
        });
      }
    } catch (error: any) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Error fetching repository data.",
        button: "Try Again",
      });
    }
  };

  useEffect(() => {
    fetchRepository();
  }, []);

  const handleLevelSelect = async (levelLabel: string) => {
    const result = await fetchSubjectsByClass(levelLabel);

    if (result.success && Array.isArray(result.data)) {
      setRepositoryData((prev) => ({
        ...prev,
        subject: result.data.map((item: string) => ({
          label: item,
          value: item,
        })),
      }));
    } else {
      setRepositoryData((prev) => ({ ...prev, subject: [] }));
    }
  };

  const handleInputChange = (sectionKey: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  const handleAdd = async (type: string) => {
    const newValue = inputValues[type];

    if (!newValue) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Missing Fields",
        textBody: `Input Required , Please enter a value for ${type}`,
        button: "Close",
      });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const response = await addRepository({
      type: type,
      text: newValue,
      token,
    });

    if (response.success) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Repository updated!",
        button: "OK",
        onHide: async () => {
          await fetchRepository();
          setInputValues((prev) => ({ ...prev, [type]: "" }));
        },
      });
    } else {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: response.message || "Something went wrong",
        button: "Try Again",
      });
    }
  };

  const handleUpdate = async (type: string) => {
    const updatedValue = inputValues[type];

    if (!updatedValue || !editData.id) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Missing Fields",
        textBody: "Please enter value before updating.",
        button: "Close",
      });
      return;
    }
    const token = await AsyncStorage.getItem("token");
    const response = await UpdateRepository({
      updateId: editData.id,
      value: updatedValue,
      token,
    });

    if (response.success) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Updated",
        textBody: "Updated Successfully!",
        button: "OK",
        onHide: async () => {
          await fetchRepository();
          setInputValues((prev) => ({ ...prev, [type]: "" }));
          setEditData({});
        },
      });
    }
  };

  const handleDelete = async (repoId: number) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: "Confirm Delete",
      textBody: "Are you sure you want to delete this item?",
      button: "Delete",
      onHide: async () => {
        const token = await AsyncStorage.getItem("token");
        const response = await DeleteRepository(repoId, token);

        if (response.success) {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Deleted",
            textBody: "Repository item deleted successfully!",
            button: "OK",
            onHide: fetchRepository,
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: response.message || "Delete failed.",
            button: "Close",
          });
        }
      },
    });
  };
  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Create Repository</Text>
          <RepositorySection
            title="Category"
            items={repositoryData.category || []}
            selectedValue={selectedValues["category"]}
            inputValue={inputValues["category"] || ""}
            editData={editData}
            onSelect={(label) => {
              const selectedItem = repositoryData.category?.find(
                (c) => c.label === label,
              );

              if (selectedItem) {
                setSelectedValues((prev) => ({
                  ...prev,
                  category: selectedItem.value,
                }));

                fetchLevelByCategory(label);
              }
            }}
            onInputChange={(text) => handleInputChange("category", text)}
            onAdd={() => handleAdd("category")}
            onUpdate={() => handleUpdate("category")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, category: label }));
              setEditData({ type: "category", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />

          <RepositorySection
            title="Education Level"
            items={repositoryData.level || []}
            selectedValue={selectedValues["level"]}
            inputValue={inputValues["level"] || ""}
            editData={editData}
            onSelect={(label) => {
              const selectedItem = repositoryData.level?.find(
                (l) => l.label === label,
              );

              if (selectedItem) {
                setSelectedValues((prev) => ({
                  ...prev,
                  level: selectedItem.value,
                }));

                handleLevelSelect(selectedItem.label);
              }
            }}
            onInputChange={(text) => handleInputChange("level", text)}
            onAdd={() => handleAdd("level")}
            onUpdate={() => handleUpdate("level")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, level: label }));
              setEditData({ type: "level", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />
          <RepositorySection
            title="Subject"
            items={repositoryData.subject || []}
            selectedValue={selectedValues["subject"]}
            inputValue={inputValues["subject"] || ""}
            editData={editData}
            onSelect={(label) => {
              const selectedItem = repositoryData.subject?.find(
                (s) => s.label === label,
              );

              if (selectedItem) {
                setSelectedValues((prev) => ({
                  ...prev,
                  subject: selectedItem.value,
                }));
              }
            }}
            onInputChange={(text) => handleInputChange("subject", text)}
            onAdd={() => handleAdd("subject")}
            onUpdate={() => handleUpdate("subject")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, subject: label }));
              setEditData({ type: "subject", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />
          <RepositorySection
            title="Books"
            items={repositoryData.book || []}
            selectedValue={selectedValues["book"]}
            inputValue={inputValues["book"] || ""}
            editData={editData}
            onSelect={(value) =>
              setSelectedValues((prev) => ({ ...prev, book: value }))
            }
            onInputChange={(text) => handleInputChange("book", text)}
            onAdd={() => handleAdd("book")}
            onUpdate={() => handleUpdate("book")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, book: label }));
              setEditData({ type: "book", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />
          <RepositorySection
            title="Language"
            items={repositoryData.language || []}
            selectedValue={selectedValues["language"]}
            inputValue={inputValues["language"] || ""}
            editData={editData}
            onSelect={(value) =>
              setSelectedValues((prev) => ({ ...prev, language: value }))
            }
            onInputChange={(text) => handleInputChange("language", text)}
            onAdd={() => handleAdd("language")}
            onUpdate={() => handleUpdate("language")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, language: label }));
              setEditData({ type: "language", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />
          <RepositorySection
            title="Resource"
            items={repositoryData.resource || []}
            selectedValue={selectedValues["resource"]}
            inputValue={inputValues["resource"] || ""}
            editData={editData}
            onSelect={(value) =>
              setSelectedValues((prev) => ({ ...prev, resource: value }))
            }
            onInputChange={(text) => handleInputChange("resource", text)}
            onAdd={() => handleAdd("resource")}
            onUpdate={() => handleUpdate("resource")}
            onEdit={(label, id) => {
              setInputValues((prev) => ({ ...prev, resource: label }));
              setEditData({ type: "resource", id });
            }}
            onDelete={(id) => handleDelete(id)}
          />
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  mainContent: {
    padding: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 28,
    marginTop: 10,
    marginBottom: 20,
  },
});
