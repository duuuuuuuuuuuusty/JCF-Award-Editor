# JCF Award Editor
For JC Ink services

## Install
Upload file as new webpage. Use script only on JC Ink's domain name, eg: myforum.jcink.com

## Usage
1. Sign in via the login interface
2. Ensure the login token is pasted in the input box. ACP tokens appear as 32 scrambled characters
3. Click _Build Awards Table_ once and sit back. This is hella slow
4. Red lines are entries that are marked for deletion
5. Yellow lines are entries that you have modified, and are marked for upload
6. Faded lines indicate entries that have already been deleted. This is (relatively) permanent
7. **DO NOT** click the _Build Awards Table_ button again at any time

### Editing Methods
Award entries can be edited and uploaded one by one, or en masse. A yellow/modified line will have a set of controls appended to the right side - the check mark will upload that line, whereas the X mark will revert the changes to that entry.

The _submits edits_ button in the bottom left will upload all entries that are marked for upload (entries indicated by a yellow background color) and then reset the marked status.

The _delete selected_ button will near permanently delete the entries selected. There is no confirmation dialogue. The only way to restore those awards would be to go into the ACP's backup system, download the latest backup file, and restore from that backup. You may need to append this file as part of a total backup, or you may be able to restore just from that excerpt.

The _replace_ functions work by exact case and exact match. They do not do partial edits to fields.

## Common Troubleshooting
1. 'My login token appears as '&login=yes" method="POST"...'
  This error commonly results from one of two cases:
    1. You are using the script from a custom domain, and not the X.jcink.com URL
    2. You have typed your password incorrectly
