import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Card, Text, Badge, Button, Group } from "@mantine/core";
import { IconAt, IconMapPin, IconCalendarStats, IconPhone } from "@tabler/icons-react";

const Record = (props) => (
  <Card
    shadow="sm"
    padding="lg"
    radius="md"
    withBorder
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
    <Card.Section inheritPadding py="md">
      <Group align="flex-start" noWrap>
        <Avatar radius="xl" size="lg" color="blue">
          {props.record.firstName?.charAt(0)}
          {props.record.lastName?.charAt(0)}
        </Avatar>

        <div style={{ flex: 1 }}>
          <div style={{ height: "25px", marginBottom: "8px" }}>
            <Text fw={700} size="sm" truncate>
              {props.record.firstName} {props.record.lastName}
            </Text>
          </div>

          <div style={{ height: "55px" }}>
            <Badge
              color="green"
              size="xs"
              fullWidth
              mb={4}
              styles={{ inner: { textOverflow: "ellipsis" } }}
            >
              {props.record.company?.name}
            </Badge>
            <Badge
              color="blue"
              size="xs"
              fullWidth
              variant="outline"
              styles={{ inner: { textOverflow: "ellipsis" } }}
            >
              {props.record.company?.department}
            </Badge>
          </div>
        </div>
      </Group>
    </Card.Section>

    <div style={{ height: "70px", marginTop: "15px" }}>
      <Group gap={5} wrap="nowrap" mb={2}>
        <IconAt size={14}color="var(--mantine-color-dimmed)" />
        <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
          {props.record.email || "—"}
        </Text>
      </Group>

      <Group gap={5} wrap="nowrap" mb={2}>
        <IconPhone size={14}color="var(--mantine-color-dimmed)" />
        <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
          {props.record.phone || "—"}
        </Text>
      </Group>

      <Group gap={5} wrap="nowrap" mb={2}>
        <IconMapPin
          size={14}
          color="var(--mantine-color-blue-filled)"
        />
        <Text size="xs" fw={500} truncate style={{ flex: 1 }}>
          {props.record.address.city}, {props.record.address.postalCode}
        </Text>
      </Group>

      <Group gap={5}>
        <IconCalendarStats
          size={14}
          color="var(--mantine-color-dimmed)"
        />
        <Text size="xs" c="dimmed">
          <Text component="span" fw={700} c="dark" size="xs">
            {props.record.age}
          </Text>{" "}
          ans
        </Text>
      </Group>
    </div>

    <div style={{ flex: 1 }} />

    <Group mt="md" grow>
      <Button
        component={Link}
        to={`/edit/${props.record._id}`}
        variant="default"
        radius="md"
        size="sm"
      >
        Edit
      </Button>
      <Button
        color="red"
        variant="light"
        radius="md"
        size="sm"
        onClick={() => props.deleteRecord(props.record._id)}
      >
        Delete
      </Button>
    </Group>
  </Card>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Liste des employés</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
        {records.map((record) => (
          <Record
            record={record}
            deleteRecord={deleteRecord}
            key={record._id}
          />
        ))}
      </div>
    </>
  );
}
